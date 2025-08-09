import { DbRepertoires } from "@/lib/types/backend-types";
import { MyOption, PuzzleMode } from "@/lib/types/types";
import { Dispatch, SetStateAction } from "react";
import Select, { type StylesConfig } from "react-select";
import styles from "./styles/PuzzleModeChoice.module.scss";

const getClasses = (mode: PuzzleMode, element: PuzzleMode) => {
    const classes = [styles.option];
    if (element === "repertoire") classes.push(styles["flex"]);
    if (mode === element) classes.push(styles["selected-option"]);
    return classes.join(" ");
};

const customSelectStyles: StylesConfig<MyOption> = {
    control: (base) => ({
        ...base,
        background: "transparent",
        border: "1px solid var(--palette-7)",
        fontSize: "1rem",
        color: "var(--palette-1)",
        boxShadow: "none",
        outline: "none",
        cursor: "pointer",

        "&:hover": {
            borderColor: "var(--palette-7)",
        },
    }),
    singleValue: (base) => ({
        ...base,
        color: "var(--palette-1)",
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: "var(--palette-5)",
        color: "var(--palette-1)",
        borderRadius: "5px",
        zIndex: 10,
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? "var(--palette-6)" : "transparent",
        color: "var(--palette-1)",
        cursor: "pointer",

        ":active": {
            backgroundColor: "var(--palette-6)",
        },
    }),
};

const PuzzleModeChoice = ({
    mode,
    setMode,
    repertoires,
    repertoire,
    setRepertoires,
    spacedPuzzlesAmount,
}: {
    mode: PuzzleMode;
    setMode: Dispatch<SetStateAction<PuzzleMode>>;
    repertoires: DbRepertoires["owned"];
    repertoire: MyOption | null;
    setRepertoires: Dispatch<SetStateAction<MyOption | null>>;
    spacedPuzzlesAmount: number;
}) => {
    const options = repertoires.map((repertoire) => ({
        value: repertoire.id,
        label: repertoire.name,
    }));

    return (
        <div className={styles.container}>
            <div className={styles.header}>PUZZLE MODE</div>
            <div className={styles.options}>
                <div
                    className={getClasses(mode, "global")}
                    onClick={() => setMode("global")}
                >
                    random
                </div>
                <div
                    className={getClasses(mode, "repertoire")}
                    onClick={() => setMode("repertoire")}
                >
                    repertoire
                    {mode === "repertoire" && (
                        <Select<MyOption, false>
                            styles={customSelectStyles}
                            options={options}
                            placeholder="Choose repertoire.."
                            onChange={(selected) => {
                                setRepertoires(selected);
                            }}
                            isSearchable={false}
                            value={
                                options.find(
                                    (opt) => opt.value === repertoire?.value
                                ) ?? null
                            }
                        />
                    )}
                </div>
                <div
                    className={getClasses(mode, "spaced")}
                    onClick={() => spacedPuzzlesAmount > 0 && setMode("spaced")}
                >
                    spaced repetition
                    <div className={styles["spaced-amount"]}>
                        {spacedPuzzlesAmount}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PuzzleModeChoice;
