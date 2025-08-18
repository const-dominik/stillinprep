import Link from "next/link";
import { CiEdit, CiRead } from "react-icons/ci";
import styles from "./styles.module.scss";

const ListElement = ({
    name,
    owner,
    accessMode,
    id,
}: {
    name: string;
    id: string;
    owner: string;
    accessMode?: "readonly" | "edit";
}) => {
    const ownerClass = accessMode ? "list-owner-30" : "list-owner-50";
    return (
        <Link href={`/repertoire/${id}`} className={styles["link"]}>
            <div className={styles["list-element"]}>
                <div className={styles["list-name"]}>{name}</div>
                <div className={styles[ownerClass]}>{owner}</div>
                {accessMode && (
                    <div className={styles["list-accessMode"]}>
                        {accessMode === "readonly" ? (
                            <CiRead
                                title="You can't make changes"
                                fontSize="1.5rem"
                                data-testid="readonly"
                            />
                        ) : (
                            <CiEdit
                                title="You can make changes"
                                fontSize="1.5rem"
                                data-testid="edit"
                            />
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
};

export default ListElement;
