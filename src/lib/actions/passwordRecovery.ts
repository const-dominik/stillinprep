"use server";

import bcrypt from "bcrypt";
import { Neo4jError } from "neo4j-driver";
import { v4 } from "uuid";
import { getNeoSession } from "../neo4j";
import {
    ChangePasswordSArgs,
    identifierSchema,
    NewTokenSchema,
} from "../schema";
import { ServerActionResponse } from "../types/backend-types";
import { isEmail, neoRecordToObj } from "../utils";
import { sendMail } from "./sendMail";

const errors = {
    parse: "Wrong arguments.",
    doesntExist: "User doesn't exist!",
    somethingWrong: "Sorry! Something went wrong.",
    invalidToken: "Token invalid or expired. Reset again.",
};

const successes = {
    email: "If an account with that email exists, email's been sent.",
    nickname: "Email sent!",
    changed: "Your password has been changed.",
};

const URL = process.env.APP_URL;

export const resetPassword = async (
    identifier: string
): ServerActionResponse<never> => {
    const parsed = identifierSchema.safeParse(identifier);

    if (!parsed.success) {
        return {
            success: false,
            error: errors["parse"],
        };
    }

    const token = v4();

    const isIdentifierEmail = isEmail(identifier);
    const loginProperty = isIdentifierEmail ? "email" : "nickname";
    const expiration = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    const query = `
        MATCH (u:User { ${loginProperty}: $identifier })
        WHERE u.password IS NOT NULL
        OPTIONAL MATCH (u)-[r:HAS_PASSWORD_RESET]->(t:PasswordResetToken)
        DELETE r, t
        CREATE (token:PasswordResetToken {
            token: $token,
            expires: datetime($expires)
        })
        CREATE (u)-[:HAS_PASSWORD_RESET]->(token)
        RETURN u.email AS email, token.token AS token
  `;

    const session = getNeoSession();

    try {
        const result = await session.run(query, {
            identifier,
            token,
            expires: expiration,
        });

        const record = result.records[0];
        const parsed = NewTokenSchema.safeParse(neoRecordToObj(record));

        if (!record || !parsed.success) {
            if (!isEmail) {
                return { success: false, error: errors["doesntExist"] };
            }

            // Account doesn't exist, but we don't want to doxx if user with email have an account
            return {
                success: true,
                message: successes["email"],
            };
        }

        await sendMail(
            record.get("email"),
            `Click here to reset your password: ${URL}/forgot-password/${token}`,
            "Password reset request"
        );

        if (!isEmail) {
            return { success: true, message: successes["nickname"] };
        }

        return {
            success: true,
            message: successes["email"],
        };
    } catch (e) {
        console.log(e);
        if (e instanceof Neo4jError) {
            return { success: false, error: e.code };
        }
        return { success: false, error: errors["somethingWrong"] };
    } finally {
        await session.close();
    }
};

export const changePassword = async (
    token: string,
    newPassword: string
): ServerActionResponse<never> => {
    const parsed = ChangePasswordSArgs.safeParse({ token, newPassword });

    if (!parsed.success) {
        return {
            success: false,
            error: errors["parse"],
        };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const session = getNeoSession();

    try {
        const result = await session.run(
            `
            MATCH (u:User)-[r:HAS_PASSWORD_RESET]->(t:PasswordResetToken { token: $token })
            WHERE t.expires > datetime()
            SET u.password = $hashedPassword
            DELETE r, t
            RETURN u as user;
        `,
            { token, hashedPassword }
        );

        if (result.records.length === 0) {
            return {
                success: false,
                error: errors["invalidToken"],
            };
        }

        return {
            success: true,
            message: successes["changed"],
        };
    } catch (e) {
        console.log(e);
        return { success: false, error: errors["somethingWrong"] };
    } finally {
        await session.close();
    }
};
