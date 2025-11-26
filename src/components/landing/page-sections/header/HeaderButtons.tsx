import { auth } from "@/lib/auth";
import Button from "./buttons/Button";
import Logout from "./buttons/Logout";
import styles from "./styles.module.scss";

type HeaderButtonsProps = {
    study?: boolean;
    logout?: boolean;
};

const HeaderButtons = async ({
    study = true,
    logout = true,
}: HeaderButtonsProps) => {
    const user = await auth();

    return (
        <>
            {!user && (
                <div className={styles.buttons}>
                    <Button href="/login" text="SIGN IN" />
                    <Button href="/register" text="SIGN UP" />
                </div>
            )}
            {user && (
                <div className={styles.buttons}>
                    {study && <Button href="/mode" text="STUDY" />}
                    {logout && <Logout />}
                </div>
            )}
        </>
    );
};

export default HeaderButtons;
