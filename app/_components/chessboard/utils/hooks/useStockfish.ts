import { useEffect, useRef, useState, useCallback } from "react";
import { MovesTreeNode } from "../MovesTree";
import { getOppositePlayer, moveToMoveHistory } from "@/app/utils";
import { Analysis, Stockfish, StockfishAPI } from "@/app/types/types";
import { parseStockfishLine } from "../stockfish";

export const useStockfish = (currentNode: MovesTreeNode): StockfishAPI => {
    const [depth, setDepth] = useState(12);
    const [multiPV, setMultiPV] = useState<Analysis>([]);
    const [isReady, setIsReady] = useState(false);

    const engineRef = useRef<Awaited<Stockfish>>(null);
    const currentNodeRef = useRef(currentNode);
    const depthRef = useRef(depth);

    useEffect(() => {
        depthRef.current = depth;
    }, [depth]);

    const sendCommand = useCallback((cmd: string) => {
        engineRef.current?.postMessage(cmd);
    }, []);

    const setPositionAndGo = useCallback(
        (moves: string) => {
            if (!engineRef.current) return;

            sendCommand("stop");
            setMultiPV([]);

            sendCommand("ucinewgame");
            sendCommand("setoption name MultiPV value 3");
            sendCommand(`position startpos moves ${moves}`);
            sendCommand(`go depth ${depth}`);
        },
        [sendCommand, depth]
    );

    useEffect(() => {
        currentNodeRef.current = currentNode;
    }, [currentNode]);

    useEffect(() => {
        setPositionAndGo(moveToMoveHistory(currentNode));
    }, [isReady, setPositionAndGo, currentNode, depth]);

    useEffect(() => {
        const loadEngine = async () => {
            const script = document.createElement("script");
            script.src = "/stockfish/stockfish.js";
            script.async = true;

            script.onload = async () => {
                if (!window.Stockfish) {
                    console.error("Stockfish global not found");
                    return;
                }

                const sf = await window.Stockfish()!;

                engineRef.current = sf;

                sf.addMessageListener((line: string) => {
                    if (line === "readyok") {
                        setIsReady(true);
                    }

                    if (line.startsWith("info") && line.includes("multipv")) {
                        const parsed = parseStockfishLine(
                            line,
                            getOppositePlayer(currentNodeRef.current.player)
                        );
                        if (
                            parsed?.multipv &&
                            parsed?.pv &&
                            parsed?.depth === depthRef.current
                        ) {
                            setMultiPV((prev) => {
                                const updated = [...prev];
                                updated[parsed.multipv! - 1] = {
                                    nodeId: currentNodeRef.current.getMoveHash(),
                                    line: parsed,
                                };

                                return updated;
                            });
                        }
                    }
                });

                sendCommand("uci");
                sendCommand("isready");
            };

            document.body.appendChild(script);
        };

        loadEngine();

        return () => {
            engineRef.current?.terminate?.();
        };
    }, [sendCommand]);

    return {
        isReady,
        multiPV,
        depth,
        setDepth,
        sendCommand,
        setPositionAndGo,
        terminate: () => engineRef.current?.terminate(),
    };
};
