"use server";

import bcrypt from "bcrypt";
import { getNeoSession } from "../neo4j";
import { DbUserSchema, LoginArgs } from "../schema";
import { DbUser, ServerActionResponse } from "../types/backend-types";
import { isEmail } from "../utils";

const errors = {
    doesntExist: "Account with provided credentials doesn't exist!",
    somethingWrong: "Something went wrong on our side. Sorry!",
};

const doesntExistResponse = {
    success: false,
    error: errors["doesntExist"],
};

export const loginUser = async (
    identifier: string,
    password: string
): ServerActionResponse<DbUser> => {
    const parsed = LoginArgs.safeParse({ identifier, password });

    if (!parsed.success) {
        return doesntExistResponse;
    }

    const session = getNeoSession();

    const isIdentifierEmail = isEmail(identifier);
    const loginProperty = isIdentifierEmail ? "email" : "nickname";

    const query = `
        MATCH (u:User)
        WHERE u.${loginProperty} = $identifier
        RETURN u AS user
    `;

    try {
        const res = await session.run(query, {
            identifier,
        });

        // Account not found
        if (res.records.length === 0) {
            return doesntExistResponse;
        }

        const record = res.records[0].get("user").properties;
        const parsed = DbUserSchema.safeParse(record);

        // Something wrong with data/more likely user doesn't have password
        if (!parsed.success || !parsed.data.password) {
            return doesntExistResponse;
        }

        const hashedPassword = parsed.data.password;
        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        // Wrong password
        if (!passwordMatch) {
            return doesntExistResponse;
        }

        return {
            success: true,
            value: parsed.data,
        };
    } catch (e) {
        console.log(e);
        return {
            success: false,
            error: errors["somethingWrong"],
        };
    } finally {
        await session.close();
    }
};
