import { auth } from "@/lib/auth";
import Button from "./buttons/Button";
import Logout from "./buttons/Logout";
import Logo from "./Logo";
import styles from "./styles.module.scss";

const Header = async () => {
    const user = await auth();

    return (
        <header className={styles.header}>
            <Logo />
            {!user && (
                <div className={styles.buttons}>
                    <Button href="/login" text="SIGN IN" />
                    <Button href="/register" text="SIGN UP" />
                </div>
            )}
            {user && (
                <div className={styles.buttons}>
                    <Button href="/mode" text="STUDY" />
                    <Logout />
                </div>
            )}
        </header>
    );
};

export default Header;
