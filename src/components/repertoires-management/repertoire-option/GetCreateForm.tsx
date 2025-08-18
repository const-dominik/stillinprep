import { Dispatch, SetStateAction, useState } from "react";

import { createRepertoire } from "@/lib/actions/repertoire";
import { useRouter } from "next/navigation";
import { GiPawn } from "react-icons/gi";
import styles from "./styles/GetCreateForm.module.scss";

const ColorChoice = ({
    color,
    onClick,
}: {
    color: "black" | "white";
    onClick: (color: "black" | "white") => void;
}) => {
    const toggleColor = () => {
        if (color === "black") {
            return onClick("white");
        }
        return onClick("black");
    };

    const classes = [];

    if (color === "black") {
        classes.push(styles["for-black"]);
    }

    return (
        <GiPawn
            onClick={toggleColor}
            className={classes.join(" ")}
            title={`For ${color}`}
        />
    );
};

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
    const [creatingColor, setCreatingColor] = useState<"white" | "black">(
        "white"
    );
    const router = useRouter();

    const addRepertoire = async () => {
        if (name.trim().length === 0 || isCreating) return;

        setIsCreating(true);
        const response = await createRepertoire(name, creatingColor);

        if (response.success && response.value) {
            router.push(
                `/repertoire/${response.value.id}?type=new&color=${creatingColor}`
            );
        }

        setIsCreating(false);
    };

    return (
        <>
            {!noAdd && (
                <div className={styles["container-form"]}>
                    <input
                        type="text"
                        placeholder={`Enter name of your new repertoire for ${creatingColor}...`}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addRepertoire()}
                        className={styles["input"]}
                    />
                    <ColorChoice
                        color={creatingColor}
                        onClick={setCreatingColor}
                    />
                    {name.trim() && (
                        <div
                            className={styles["plus"]}
                            onClick={() => !isCreating && addRepertoire()}
                        >
                            +
                        </div>
                    )}
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
