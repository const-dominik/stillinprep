"use client";

import { MovesTreeNode } from "../_components/chessboard/utils/MovesTree";
import Chessboard from "../_components/chessboard/Chessboard";
import MoveHistory from "../_components/chessboard/MoveHistory";
import styles from "./page.module.scss";
import { Pieces } from "../types";
import { useState } from "react";

const ChildComponent = () => {
    const [currentNode, setCurrentNode] = useState(
        new MovesTreeNode(Pieces.EMPTY, [0, 0], [0, 0])
    );

    return (
        <div className={styles.container}>
            <Chessboard
                currentNode={currentNode}
                setCurrentNode={setCurrentNode}
            />
            <MoveHistory
                currentNode={currentNode}
                setCurrentNode={setCurrentNode}
            />
        </div>
    );
};

export default ChildComponent;
