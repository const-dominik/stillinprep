import { auth } from "@/lib/auth";
import Button from "./buttons/Button";
import Logout from "./buttons/Logout";
import Logo from "./Logo";
import styles from "./styles.module.scss";

const Header = async ({
    logo = true,
    study = true,
    logout = true,
}: {
    logo?: boolean;
    study?: boolean;
    logout?: boolean;
}) => {
    const user = await auth();

    return (
        <header className={styles.header}>
            {logo && <Logo />}
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
        </header>
    );
};

export default Header;
