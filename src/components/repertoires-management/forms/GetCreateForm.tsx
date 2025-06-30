import { Dispatch, SetStateAction, useState } from "react";

import { createRepertoire } from "@/lib/actions/repertoire";
import { useRouter } from "next/navigation";
import styles from "./styles/GetCreateForm.module.scss";

const GetCreateForm = ({
    search,
    setSearch,
    hasRepertoires,
}: {
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
    hasRepertoires: boolean;
}) => {
    const [name, setName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();

    const addRepertoire = async () => {
        if (name.trim().length === 0 || isCreating) return;

        setIsCreating(true);
        const newRepertoire = await createRepertoire(name);
        router.push(`/repertoire/${newRepertoire.id}`);
    };

    return (
        <>
            <div className={styles["container-form"]}>
                <input
                    type="text"
                    placeholder="New repertoire..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addRepertoire()}
                    className={styles["input"]}
                />
                <div className={styles["plus"]} onClick={() => addRepertoire()}>
                    +
                </div>
            </div>
            {hasRepertoires && (
                <div className={styles["container-form"]}>
                    <input
                        type="text"
                        placeholder="Find repertoire..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={styles["input"]}
                    />
                </div>
            )}
        </>
    );
};

export default GetCreateForm;
