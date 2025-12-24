import styles from "./Feature.module.scss";

const Feature = ({ icon, text }: { icon: string; text: string }) => {
    return (
        <div className={styles.feature}>
            <div className={styles.featureIcon}>{icon}</div>
            <span className={styles.featureText}>{text}</span>
        </div>
    );
};

export default Feature;
