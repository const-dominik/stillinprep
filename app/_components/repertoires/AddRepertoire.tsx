"use client";

import { useState } from "react";
import styles from "./styles.module.scss";
import { useRouter } from "next/navigation";
import { createRepertoire } from "@/app/actions/repertoire";

const AddRepertoire = () => {
    const [name, setName] = useState("");
    const router = useRouter();

    const addRepertoire = async () => {
        if (name.length === 0) return;

        const newRepertoire = await createRepertoire(name);
        router.push(`/repertoire/${newRepertoire.id}`);
    };

    return (
        <div className={styles["container-form"]}>
            <input
                type="text"
                placeholder="New repertoire..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addRepertoire()}
                className={styles.input}
            />
            <div className={styles.plus} onClick={() => addRepertoire()}>
                +
            </div>
        </div>
    );
};

export default AddRepertoire;
