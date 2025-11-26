"use client";

import { ConfirmProvider } from "@/lib/context/confirm/ConfirmContext";
import { DbRepertoires } from "@/lib/types/backend-types";
import { type User } from "next-auth";
import { Back, GoToPuzzle } from "../utils/component/Utils";
import OwnedList from "./lists/OwnedList";
import PublicList from "./lists/PublicList";
import SharedList from "./lists/SharedList";
import styles from "./RepertoireList.module.scss";

const RepertoireList = ({
    allRepertoires,
    user,
}: {
    allRepertoires: DbRepertoires;
    user: User;
}) => {
    return (
        <div>
            <div className={styles["nav"]}>
                <Back url="/mode" />
                <GoToPuzzle />
            </div>
            <div className={styles["window-container"]}>
                <PublicList
                    publicRepertoires={allRepertoires["public"]}
                    user={user}
                />
                <ConfirmProvider>
                    <OwnedList
                        ownedRepertoires={allRepertoires["owned"]}
                        user={user}
                    />
                </ConfirmProvider>
                <SharedList sharedRepertoires={allRepertoires["shared"]} />
            </div>
        </div>
    );
};

export default RepertoireList;
