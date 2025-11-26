import { Suspense } from "react";
import HeaderButtons from "./HeaderButtons";
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
    return (
        <header className={styles.header}>
            {logo && <Logo />}
            <Suspense>
                <HeaderButtons study={study} logout={logout} />
            </Suspense>
        </header>
    );
};

export default Header;
