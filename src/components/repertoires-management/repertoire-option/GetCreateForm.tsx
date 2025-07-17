import { Dispatch, SetStateAction, useState } from "react";

import { createRepertoire } from "@/lib/actions/repertoire";
import { useRouter } from "next/navigation";
import styles from "./styles/GetCreateForm.module.scss";

const GetCreateForm = ({
    search,
    setSearch,
    hasRepertoires,
    noAdd,
}: {
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
    hasRepertoires: boolean;
    noAdd?: boolean;
}) => {
    const [name, setName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();

    const addRepertoire = async () => {
        if (name.trim().length === 0) return;

        setIsCreating(true);
        const response = await createRepertoire(name);

        if (response.success && response.value) {
            router.push(`/repertoire/${response.value.id}`);
        }

        setIsCreating(false);
    };

    return (
        <>
            {!noAdd && (
                <div className={styles["container-form"]}>
                    <input
                        type="text"
                        placeholder="New repertoire..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addRepertoire()}
                        className={styles["input"]}
                    />
                    <div
                        className={styles["plus"]}
                        onClick={() => !isCreating && addRepertoire()}
                    >
                        +
                    </div>
                </div>
            )}
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
