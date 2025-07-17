"use server";

import bcrypt from "bcrypt";
import { Neo4jError } from "neo4j-driver";
import { v4 } from "uuid";
import { ZodError, z } from "zod/v4";
import { getNeoSession } from "../neo4j";
import { RegisterSchema } from "../schema";
import { ServerActionResponse } from "../types/backend-types";
import { RegistrationData } from "../types/types";
import { sendMail } from "./sendMail";

const errors = {
    somethingWrong: "Something went wrong on our side. Sorry!",
    doesntExist:
        "Token doesn't exist. If your account isn't verified, try logging in and resending verification email.",
    expired: "Token is expired! Sent new link to email.",
    parsing: "Something went wrong with parsing. Sorry!",
    cantCreate: "Couldn't create verification token.",
    nickTaken: "Nickname already exists.",
};

const successes = {
    sent: "If this email isn't registered, we'll send a verification link shortly.",
};

export const verifyEmail = async (
    token: string
): ServerActionResponse<never> => {
    if (!token.length) {
        return {
            success: false,
            error: errors["somethingWrong"],
        };
    }

    const session = getNeoSession();

    try {
        const result = await session.run(
            `
            MATCH (u:User)-[r:HAS_TOKEN]->(t:VerificationToken { token: $token })
            WHERE t.expires > datetime()
            SET u.emailVerified = datetime()
            DELETE r, t
            RETURN u as user;
        `,
            {
                token,
            }
        );

        if (result.records.length === 0) {
            const expiredCheck = await session.run(
                `MATCH (u:User)-[:HAS_TOKEN]->(t:VerificationToken { token: $token })
                RETURN u { .email } AS email`,
                { token }
            );

            if (expiredCheck.records.length === 0) {
                return {
                    success: false,
                    error: errors["doesntExist"],
                };
            }
            const parsed = z
                .email()
                .safeParse(expiredCheck.records[0].get("email"));

            if (!parsed.success) {
                return {
                    success: false,
                    error: errors["parsing"],
                };
            }

            await createVerificationToken(
                expiredCheck.records[0].get("email").email
            );

            return {
                success: false,
                error: errors["expired"],
            };
        }

        return { success: true };
    } catch (e) {
        if (e instanceof Neo4jError) {
            return { success: false, error: e.code };
        }
        return { success: false, error: errors["somethingWrong"] };
    } finally {
        await session.close();
    }
};

export const createVerificationToken = async (
    email: string
): ServerActionResponse<never> => {
    const parsedArg = z.email().safeParse({ email });

    if (!parsedArg.success) {
        return {
            success: false,
            error: errors["parsing"],
        };
    }

    const token = v4();
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);

    const session = getNeoSession();

    const createTokenQuery = `
        MATCH (u:User { email: $email })
        CREATE (t:VerificationToken {
          token: $token,
          expires: datetime($expires)
        })
        CREATE (u)-[:HAS_TOKEN]->(t)
        RETURN t
    `;

    const deleteTokenQuery = `
        MATCH (u:User { email: $email })-[r:HAS_TOKEN]->(t:VerificationToken)
        DELETE r, t
    `;

    try {
        await session.executeWrite(async (tx) => {
            await tx.run(deleteTokenQuery, { email });

            await tx.run(createTokenQuery, {
                email,
                token,
                expires: expires.toISOString(),
            });
        });

        const URL = process.env.APP_URL;
        await sendMail(
            email,
            `Click here to verify your account: ${URL}/register/verify/${token}`,
            "Verify your account"
        );

        return {
            success: true,
        };
    } catch (err) {
        console.error("Error creating verification token:", err);
        return {
            success: false,
            error: errors["cantCreate"],
        };
    } finally {
        await session.close();
    }
};

export const registerUser = async (
    formData: RegistrationData
): ServerActionResponse<never> => {
    const parsed = RegisterSchema.safeParse(formData);

    if (!parsed.success) {
        return { success: false, error: errors["parsing"] };
    }

    const { nickname, password, email } = parsed.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
        OPTIONAL MATCH (existingUser:User { email: $email })
        WHERE existingUser.emailVerified IS NULL
        OPTIONAL MATCH (existingUser)-[r:HAS_TOKEN]->(t:VerificationToken)
        FOREACH (_ IN CASE WHEN existingUser IS NOT NULL THEN [1] ELSE [] END |
            DETACH DELETE existingUser, t
        )

        CREATE (u:User {
            id: $id,
            email: $email,
            password: $password,
            nickname: $nickname,
            name: null,
            emailVerified: null,
            image: null
        })
        RETURN u { .id, .nickname, .email } AS user
    `;
    const session = getNeoSession();

    try {
        await session.run(query, {
            id: v4(),
            email,
            nickname,
            password: hashedPassword,
        });

        await createVerificationToken(email);

        return {
            success: true,
            message: successes["sent"],
        };
    } catch (e) {
        if (e instanceof Neo4jError) {
            const isItEmail = e.message.includes("property `email`");

            if (isItEmail) {
                return {
                    success: true,
                    message: successes["sent"],
                };
            }

            const isItNickname = e.message.includes("property `nickname`");

            return {
                success: false,
                error: isItNickname ? errors["nickTaken"] : e.code,
            };
        }
        if (e instanceof ZodError) {
            return {
                success: false,
                error: errors["parsing"],
            };
        }

        return { success: false, error: errors["somethingWrong"] };
    } finally {
        await session.close();
    }
};
