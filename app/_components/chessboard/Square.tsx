import { Pieces } from "@/app/types";
import Image from "next/image";
import styles from "./styles.module.scss";
import { pieceAssets } from "@/app/utils";

type SquareProps = {
    x: number;
    y: number;
    piece: Pieces;
    isSelected: boolean;
    isMoveLegal: boolean;
    isPieceOnSquare: boolean;
    isChecked: boolean;
    promotionData: [boolean, boolean];
    onClick: (x: number, y: number) => void;
};

const Square = ({
    x,
    y,
    piece,
    isSelected,
    isMoveLegal,
    isPieceOnSquare,
    isChecked,
    promotionData,
    onClick,
}: SquareProps) => {
    const isDark = (x + y) % 2 === 1;
    const classes = [];
    const [promoting, isChoosable] = promotionData;
    if (!promoting || isChoosable) classes.push(styles.pointer);

    if (isDark) {
        classes.push(styles.dark);

        if (isMoveLegal) {
            if (isPieceOnSquare) {
                classes.push(styles["under-attack-dark"]);
            } else {
                classes.push(styles["legal-dark-move"]);
            }
        }

        if (isChecked) {
            classes.push(styles["checked-dark"]);
        }
    } else {
        classes.push(styles.light);

        if (isMoveLegal) {
            if (isPieceOnSquare) {
                classes.push(styles["under-attack-light"]);
            } else {
                classes.push(styles["legal-light-move"]);
            }
        }

        if (isChecked) {
            classes.push(styles["checked-light"]);
        }
    }

    if (isSelected) {
        classes.push(styles.selected);
    }

    return (
        <div className={classes.join(" ")} onClick={() => onClick(x, y)}>
            {promoting && !isChoosable && <div className={styles.overlay} />}
            {piece !== Pieces.EMPTY && (
                <Image
                    src={pieceAssets[piece]}
                    alt="piece"
                    width={70}
                    height={70}
                />
            )}
        </div>
    );
};

export default Square;
