"use client";

import { signOut } from "next-auth/react";
import styles from "./styles.module.scss";

const Logout = () => {
    return (
        <div className={styles.button} onClick={() => signOut()}>
            LOG OUT
        </div>
    );
};

export default Logout;
