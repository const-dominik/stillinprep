"use client";

import { ConfirmProvider } from "@/lib/context/confirm/ConfirmContext";
import { DbRepertoires } from "@/lib/types/backend-types";
import { Back, GoToPuzzle } from "../utils/Utils";
import OwnedList from "./lists/OwnedList";
import PublicList from "./lists/PublicList";
import SharedList from "./lists/SharedList";
import styles from "./RepertoireList.module.scss";

const RepertoireList = ({
    allRepertoires,
}: {
    allRepertoires: DbRepertoires;
}) => {
    return (
        <ConfirmProvider>
            <div>
                <div className={styles["nav"]}>
                    <Back url="/mode" />
                    <GoToPuzzle />
                </div>
                <div className={styles["window-container"]}>
                    <PublicList publicRepertoires={allRepertoires["public"]} />
                    <OwnedList ownedRepertoires={allRepertoires["owned"]} />
                    <SharedList sharedRepertoires={allRepertoires["shared"]} />
                </div>
            </div>
        </ConfirmProvider>
    );
};

export default RepertoireList;
