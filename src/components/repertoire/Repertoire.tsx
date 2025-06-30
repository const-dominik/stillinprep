"use client";

import Chessboard from "@/components/repertoire/chessboard/Chessboard";
import MoveHistory from "@/components/repertoire/history/MoveHistory";
import MovePopularity from "@/components/repertoire/movepopularity/MovePopularity";
import ScoreMeter from "@/components/repertoire/scoremeter/ScoreMeter";
import StockfishAnalysis from "@/components/repertoire/stockfish/StockfishAnalysis";
import { ConfirmProvider } from "@/lib/context/confirm/ConfirmContext";

import { PositionProvider } from "@/lib/context/current-position/PositionContext";
import { RepertoireProvider } from "@/lib/context/repertoire/RepertoireContext";
import { StockfishProvider } from "@/lib/context/stockfish/StockfishContext";
import { DbRepertoire } from "@/lib/types/backend-types";
import styles from "./Repertoire.module.scss";

const Repertoire = ({
    repertoireId,
    repertoireData,
}: {
    repertoireId: string;
    repertoireData: DbRepertoire;
}) => {
    return (
        <ConfirmProvider>
            <RepertoireProvider
                repertoireData={repertoireData}
                repertoireId={repertoireId}
            >
                <PositionProvider>
                    <StockfishProvider>
                        <div className={styles["container"]}>
                            <div className={styles["moves-info"]}>
                                <StockfishAnalysis />
                                <MovePopularity />
                            </div>
                            <ScoreMeter />
                            <Chessboard />
                            <MoveHistory />
                        </div>
                    </StockfishProvider>
                </PositionProvider>
            </RepertoireProvider>
        </ConfirmProvider>
    );
};

export default Repertoire;
