"use client";

import { registerUser } from "@/lib/actions/register";
import { FormFields, RegistrationData } from "@/lib/types/types";
import { emailRegex, nicknameRegex } from "@/lib/utils";
import { validatePassword } from "../utils/auth";
import GenericAuthForm from "../utils/component/GenericAuthForm";

const RegistrationForm = () => {
    const fields: FormFields<RegistrationData> = [
        {
            label: "Nickname",
            name: "nickname",
            options: {
                required: "Nickname is required!",
                pattern: {
                    value: nicknameRegex,
                    message:
                        "Nickname can consist only of numbers, letters and underscores.",
                },
                minLength: {
                    value: 3,
                    message: "Nickname has to be at least 3 characters long.",
                },
                maxLength: {
                    value: 20,
                    message: "Nickname has to be at most 20 characters long.",
                },
            },
        },
        {
            label: "Email",
            name: "email",
            options: {
                required: "Email is required!",
                pattern: {
                    value: emailRegex,
                    message: "It has to be an email!",
                },
            },
        },
        {
            label: "Password",
            name: "password",
            options: {
                required: "Password is required!",
                validate: validatePassword,
            },
        },
        {
            label: "Confirm Password",
            name: "confirmPassword",
            options: {
                required: "You need to confirm your password!",
                validate: (value, form) =>
                    value === form["password"] || "Passwords don't match.",
            },
        },
    ];

    const submitAction = async (data: RegistrationData) =>
        await registerUser(data);

    return (
        <GenericAuthForm<RegistrationData>
            awaitingMessage="Registering..."
            submitMessage="REGISTER"
            submitAction={submitAction}
            fields={fields}
            mode="onChange"
        />
    );
};

export default RegistrationForm;
