"use client";

import { resetPassword } from "@/lib/actions/passwordRecovery";
import { FormFields } from "@/lib/types/types";
import GenericAuthForm from "../utils/component/GenericAuthForm";

type ForgotPassword = {
    identifier: string;
};

const ForgotPassword = () => {
    const fields: FormFields<ForgotPassword> = [
        {
            label: "Nickname/Email",
            name: "identifier",
            options: {
                required: true,
            },
        },
    ];

    const submitAction = async (data: ForgotPassword) =>
        await resetPassword(data.identifier);

    return (
        <GenericAuthForm<ForgotPassword>
            submitAction={submitAction}
            awaitingMessage="Sending reset email..."
            submitMessage="RESET"
            fields={fields}
        />
    );
};

export default ForgotPassword;
