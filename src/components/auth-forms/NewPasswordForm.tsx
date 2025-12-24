"use client";

import { changePassword } from "@/lib/actions/passwordRecovery";
import { FormFields } from "@/lib/types/types";
import { validatePassword } from "../utils/auth";
import GenericAuthForm from "../utils/component/GenericAuthForm";

type NewPasswordData = {
    password: string;
    confirmPassword: string;
};

const NewPassword = ({ token }: { token: string }) => {
    const submitAction = async (data: NewPasswordData) =>
        await changePassword(token, data.password);

    const fields: FormFields<NewPasswordData> = [
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
                validate: (value, formData) =>
                    value === formData["password"] || "Passwords don't match.",
            },
        },
    ];

    return (
        <GenericAuthForm<NewPasswordData>
            mode="onChange"
            awaitingMessage="Changing password..."
            submitMessage="SET PASSWORD"
            fields={fields}
            submitAction={submitAction}
            redirectPath="/login"
            redirectDelay={500}
        />
    );
};

export default NewPassword;
