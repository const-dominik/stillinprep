"use client";

import Chessboard from "@/components/repertoire/chessboard/Chessboard";
import MoveHistory from "@/components/repertoire/history/MoveHistory";
import MovePopularity from "@/components/repertoire/movepopularity/MovePopularity";
import ScoreMeter from "@/components/repertoire/scoremeter/ScoreMeter";
import StockfishAnalysis from "@/components/repertoire/stockfish/StockfishAnalysis";
import { ConfirmProvider } from "@/lib/context/confirm/ConfirmContext";

import { PositionProvider } from "@/lib/context/current-position/PositionContext";
import {
    RepertoireProvider,
    useRepertoire,
} from "@/lib/context/repertoire/RepertoireContext";
import { StockfishProvider } from "@/lib/context/stockfish/StockfishContext";
import { DbRepertoire } from "@/lib/types/backend-types";
import { MovePopualritySettings } from "@/lib/types/types";
import { useState } from "react";
import { Back, GoToPuzzle } from "../utils/Utils";
import styles from "./Repertoire.module.scss";
import HolesAnalysis from "./analysis/HolesAnalysis";

const RepertoireWithProviders = ({
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
                        <Repertoire />
                    </StockfishProvider>
                </PositionProvider>
            </RepertoireProvider>
        </ConfirmProvider>
    );
};

const Repertoire = () => {
    const { timeControls, ratings } = useRepertoire();

    const [settings, setSettings] = useState<MovePopualritySettings>({
        timeControls,
        ratings,
    });

    return (
        <div>
            <div className={styles["nav"]}>
                <Back url="/repertoire" />
                <GoToPuzzle />
            </div>
            <div className={styles["container"]}>
                <div className={styles["moves-info"]}>
                    <StockfishAnalysis />
                    <MovePopularity
                        settings={settings}
                        setSettings={setSettings}
                    />
                </div>
                <div className={styles["chess-meter"]}>
                    <ScoreMeter />
                    <Chessboard />
                </div>
                <div className={styles["right-side"]}>
                    <HolesAnalysis settings={settings} />
                    <MoveHistory mode="regular" />
                </div>
            </div>
        </div>
    );
};

export default RepertoireWithProviders;
