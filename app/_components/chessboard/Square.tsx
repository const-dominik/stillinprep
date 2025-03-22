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
    onClick: (x: number, y: number) => void;
};

const Square = ({
    x,
    y,
    piece,
    isSelected,
    isMoveLegal,
    onClick,
}: SquareProps) => {
    const isDark = (x + y) % 2 === 1;
    const classes = [];
    classes.push(isDark ? styles.dark : styles.light);
    if (isSelected) {
        classes.push(styles.selected);
    }
    if (isMoveLegal) {
        classes.push(styles.legalmove);
    }

    return (
        <div className={classes.join(" ")} onClick={() => onClick(x, y)}>
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
