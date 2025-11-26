"use client";

import { completeProfile } from "@/lib/actions/completeProfile";
import { FormFields } from "@/lib/types/types";
import { nicknameRegex } from "@/lib/utils";
import GenericAuthForm from "../utils/component/GenericAuthForm";

type CompleteProfileData = {
    nickname: string;
};

const CompleteProfileForm = ({ id }: { id: string }) => {
    const submitAction = async (data: CompleteProfileData) =>
        await completeProfile(id, data.nickname);

    const fields: FormFields<CompleteProfileData> = [
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
    ];

    return (
        <GenericAuthForm<CompleteProfileData>
            mode="onChange"
            submitAction={submitAction}
            submitMessage="COMPLETE"
            awaitingMessage="Completing.."
            redirectPath="/"
            redirectDelay={500}
            fields={fields}
        />
    );
};

export default CompleteProfileForm;
