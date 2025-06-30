import { createContext, ReactNode, useContext, useState } from "react";
import styles from "./ConfirmContext.module.scss";

type ConfirmContextValue = {
    confirm: (message: string) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [resolveFn, setResolveFn] = useState<(value: boolean) => void>();

    const confirm = (msg: string) => {
        setMessage(msg);
        setIsOpen(true);

        return new Promise<boolean>((resolve) => {
            setResolveFn(() => resolve);
        });
    };

    const handleClose = (answer: boolean) => {
        setIsOpen(false);
        if (resolveFn) resolveFn(answer);
    };

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            {isOpen && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <p className={styles.message}>{message}</p>
                        <div className={styles.actions}>
                            <button
                                onClick={() => handleClose(false)}
                                className={styles.option}
                            >
                                No
                            </button>
                            <button
                                onClick={() => handleClose(true)}
                                className={styles.option}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    );
};

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context)
        throw new Error("useConfirm must be used within ConfirmProvider");
    return context.confirm;
};
