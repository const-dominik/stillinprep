"use client";

import { MovesTreeNode } from "../_components/chessboard/utils/MovesTree";
import Chessboard from "../_components/chessboard/Chessboard";
import MoveHistory from "../_components/chessboard/MoveHistory";
import styles from "./page.module.scss";
import { useState } from "react";

const ChildComponent = () => {
    const [currentNode, setCurrentNode] = useState(new MovesTreeNode());
    const [lastNode, setLastNode] = useState(currentNode);

    return (
        <div className={styles.container}>
            <Chessboard
                currentNode={currentNode}
                setCurrentNode={setCurrentNode}
                setLastNode={setLastNode}
            />
            <MoveHistory
                currentNode={currentNode}
                setCurrentNode={setCurrentNode}
                lastNode={lastNode}
                setLastNode={setLastNode}
            />
        </div>
    );
};

export default ChildComponent;
