import {
    getInputClasses,
    getLabelClasses,
    labelToId,
} from "@/components/utils/Utils";
import { checkUserExists, deleteRepertoire } from "@/lib/actions/repertoire";
import { useConfirm } from "@/lib/context/confirm/ConfirmContext";
import { GivenAccess, MyOption, RepertoireEditData } from "@/lib/types/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
    type Control,
    Controller,
    type FieldError,
    type UseFormSetValue,
} from "react-hook-form";
import { AiOutlinePlus } from "react-icons/ai";
import { CiEdit, CiRead } from "react-icons/ci";
import { GiPawn } from "react-icons/gi";
import { IoMdRemove } from "react-icons/io";
import Select, { type StylesConfig } from "react-select";
import utilStyles from "../../utils/Utils.module.scss";
import styles from "./styles/RepertoireEditFields.module.scss";

export const UserAccessFields = ({
    setValue,
    baseAccesses,
    setUserError,
    setIsCheckingUser,
    nickname,
}: {
    setValue: UseFormSetValue<RepertoireEditData>;
    baseAccesses: GivenAccess[];
    setUserError: Dispatch<SetStateAction<string>>;
    setIsCheckingUser: Dispatch<SetStateAction<boolean>>;
    nickname: string;
}) => {
    const [chosenMode, setChosenMode] = useState<"readonly" | "edit">(
        "readonly"
    );
    const [name, setName] = useState("");
    const [accesses, setAccesses] = useState<GivenAccess[]>(baseAccesses);

    useEffect(() => {
        setValue("hasAccess", accesses);
    }, [accesses, setValue]);

    const userExists = (nickname: string) =>
        accesses.some((el) => el.nickname === nickname);

    const addAccess = async () => {
        if (name.length < 3) {
            setUserError("Username must be at least 3 characters");
            return;
        }

        if (name === nickname) {
            setUserError("You can't share your own repertoire with yourself!");
            return;
        }

        if (userExists(name)) {
            setUserError("User already has access");
            return;
        }

        setIsCheckingUser(true);
        setUserError("");

        try {
            const userExistsInDb = await checkUserExists(name);

            if (userExistsInDb.success && !userExistsInDb.value) {
                setUserError(`User ${name} doesn't exist!`);
                return;
            }

            setAccesses((prev) => [
                ...prev,
                { nickname: name, mode: chosenMode },
            ]);
            setName("");
            setChosenMode("readonly");
            setUserError("");
        } catch (error) {
            setUserError("Failed to verify user");
        } finally {
            setIsCheckingUser(false);
        }
    };

    const removeAccess = (nickname: string) => {
        setAccesses((prev) => prev.filter((el) => el.nickname !== nickname));
    };

    const renderAccessIcon = (mode: "readonly" | "edit") =>
        mode === "readonly" ? (
            <CiRead
                title="Readonly"
                style={{ cursor: "default" }}
                fontSize="1.5rem"
            />
        ) : (
            <CiEdit
                title="Can edit"
                style={{ cursor: "default" }}
                fontSize="1.5rem"
            />
        );

    const isChosen = (mode: "readonly" | "edit") => chosenMode === mode;

    return (
        <div className={utilStyles["input-group"]}>
            <div
                aria-labelledby={labelToId("hasAccess")}
                className={styles.accessContainer}
            >
                <div className={styles.line}>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={styles["small-input"]}
                        type="text"
                        placeholder="Enter nickname"
                        aria-label="Nickname input"
                    />
                    <label
                        className={getLabelClasses(false)}
                        id={labelToId("hasAccess")}
                    >
                        Users with Access
                    </label>

                    <div className={styles.icons}>
                        <div
                            className={
                                isChosen("readonly")
                                    ? styles.chosenIcon
                                    : styles.icon
                            }
                            onClick={() => setChosenMode("readonly")}
                            title="Readonly"
                        >
                            <CiRead fontSize="1.5rem" />
                        </div>
                        <div
                            className={
                                isChosen("edit")
                                    ? styles.chosenIcon
                                    : styles.icon
                            }
                            onClick={() => setChosenMode("edit")}
                            title="Can edit"
                        >
                            <CiEdit fontSize="1.5rem" />
                        </div>
                    </div>

                    <AiOutlinePlus
                        fontSize="2rem"
                        title="Add user"
                        onClick={addAccess}
                        style={{ cursor: "pointer" }}
                    />
                </div>

                {accesses.length > 0 && (
                    <div className={styles.accesses}>
                        {accesses.map(({ nickname, mode }) => (
                            <div
                                key={nickname}
                                className={styles["user-access-row"]}
                            >
                                <div className={styles["nick-and-icon"]}>
                                    {renderAccessIcon(mode)}
                                    <p className={styles.nickname}>
                                        {nickname}
                                    </p>
                                </div>
                                <IoMdRemove
                                    fontSize="1rem"
                                    title="Remove access"
                                    onClick={() => removeAccess(nickname)}
                                    style={{ cursor: "pointer" }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export const RepertoireColor = ({
    color,
    setValue,
}: {
    color: "white" | "black";
    setValue: UseFormSetValue<RepertoireEditData>;
}) => {
    const [selectedColor, setSelectedColor] = useState<"white" | "black">(
        color
    );

    const toggleColor = () =>
        setSelectedColor((prevColor) => {
            if (prevColor === "white") return "black";
            return "white";
        });

    useEffect(() => {
        setValue("color", selectedColor);
    }, [selectedColor, setValue]);

    const classes = [];
    if (selectedColor === "black") {
        classes.push(styles["black-icon"]);
    }

    return (
        <GiPawn
            fontSize="2rem"
            onClick={() => toggleColor()}
            className={classes.join(" ")}
        />
    );
};

const customSelectStyles: StylesConfig<MyOption> = {
    control: (base) => ({
        ...base,
        background: "transparent",
        border: "none",
        padding: "2px",
        fontSize: "1rem",
        color: "var(--palette-2)",
        boxShadow: "none",
        outline: "none",
        "&:hover": {
            borderColor: "var(--palette-4)",
        },
    }),
    singleValue: (base) => ({
        ...base,
        color: "var(--palette-2)",
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: "var(--palette-5)",
        color: "var(--palette-2)",
        borderRadius: "5px",
        zIndex: 10,
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? "var(--palette-6)" : "transparent",
        color: "var(--palette-2)",
        cursor: "pointer",

        ":active": {
            backgroundColor: "var(--palette-6)",
        },
    }),
};

export const UseFormSelect = ({
    control,
    options,
    label,
    error,
}: {
    options: MyOption[];
    label: string;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    control: Control<RepertoireEditData, any, RepertoireEditData>;
    error?: FieldError;
}) => {
    return (
        <div className={utilStyles["input-group"]}>
            <Controller
                control={control}
                name="visibility"
                render={({ field: { onChange, name, value, ref } }) => (
                    <Select<MyOption, false>
                        options={options}
                        ref={ref}
                        name={name}
                        styles={customSelectStyles}
                        aria-labelledby={labelToId(label)}
                        className={getInputClasses(Boolean(error))}
                        placeholder="Make private/public.."
                        menuPlacement="auto"
                        menuPosition="fixed"
                        onChange={(selected) => {
                            onChange(selected?.value);
                        }}
                        isSearchable={false}
                        value={
                            options.find((opt) => opt.value === value) ?? null
                        }
                    />
                )}
            />
            <label
                className={getLabelClasses(Boolean(error))}
                id={labelToId(label)}
            >
                {label}
            </label>
            {error && (
                <p className={utilStyles["error-message"]}>{error.message}</p>
            )}
        </div>
    );
};

export const RemoveButton = ({
    id,
    setEditedSettingsId,
    setRemovedRepertoires,
}: {
    id: string;
    setEditedSettingsId: Dispatch<SetStateAction<string>>;
    setRemovedRepertoires: Dispatch<SetStateAction<string[]>>;
}) => {
    const confirm = useConfirm();

    const remove = async () => {
        const isSure = await confirm(
            "Are you sure? This cannot be undone and will delete your repertoire."
        );

        if (isSure) {
            setRemovedRepertoires((prev) => [...prev, id]);
            setEditedSettingsId("");
            await deleteRepertoire(id);
        }
    };

    return (
        <div className={styles.delete} onClick={remove}>
            DELETE
        </div>
    );
};
