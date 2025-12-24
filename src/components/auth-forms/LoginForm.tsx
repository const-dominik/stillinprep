"use client";

import { ServerActionResponse } from "@/lib/types/backend-types";
import { FormFields } from "@/lib/types/types";
import { emailRegex, nicknameRegex } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { getErrorMessage } from "../utils/auth";
import GenericAuthForm from "../utils/component/GenericAuthForm";

type LoginData = {
    loginOrEmail: string;
    password: string;
};

const LoginForm = () => {
    const searchParams = useSearchParams();
    const defaultError = searchParams.get("error");

    const fields: FormFields<LoginData> = [
        {
            label: "Nickname/Email",
            name: "loginOrEmail",
            options: {
                required: "Nickname or email is required.",
                validate: (value) =>
                    (nicknameRegex.test(value) && value.length >= 3) ||
                    emailRegex.test(value) ||
                    "Type proper nickname or email.",
            },
        },
        {
            label: "Password",
            name: "password",
            options: {
                required: "Password is required!",
            },
        },
    ];

    const submitAction = async (
        data: LoginData
    ): ServerActionResponse<never> => {
        const result = await signIn("credentials", {
            redirect: false,
            identifier: data.loginOrEmail,
            password: data.password,
        });

        if (result.ok && !result.error) {
            return {
                success: true,
                message: "",
            };
        } else {
            return {
                success: false,
                error: getErrorMessage(result.code || ""),
            };
        }
    };

    return (
        <GenericAuthForm<LoginData>
            defaultError={defaultError}
            mode="onChange"
            fields={fields}
            redirectPath="/"
            submitAction={submitAction}
            awaitingMessage="Signing in..."
            submitMessage="LOGIN"
        />
    );
};

export default LoginForm;
