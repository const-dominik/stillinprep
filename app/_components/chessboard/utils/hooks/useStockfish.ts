import { useEffect, useRef, useState, useCallback } from "react";
import { MovesTreeNode } from "../MovesTree";
import { getOppositePlayer, moveToMoveHistory } from "@/app/utils";
import { Analysis, Stockfish, StockfishAPI } from "@/app/types/types";
import { parseStockfishLine } from "../stockfish";

export const useStockfish = (currentNode: MovesTreeNode): StockfishAPI => {
    const [depth, setDepth] = useState(15);
    const [multiPV, setMultiPV] = useState<Analysis>([]);
    const [isReady, setIsReady] = useState(false);

    const engineRef = useRef<Awaited<Stockfish>>(null);
    const currentNodeRef = useRef(currentNode);
    const depthRef = useRef(depth);
    const updateBuffer = useRef<Analysis>([]);

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

    // keep depth up to date
    useEffect(() => {
        depthRef.current = depth;
    }, [depth]);

    // keep current node up to date
    useEffect(() => {
        currentNodeRef.current = currentNode;
    }, [currentNode]);

    // run new analysis on ready/node/depth change
    useEffect(() => {
        setPositionAndGo(moveToMoveHistory(currentNode));
    }, [isReady, currentNode, depth, setPositionAndGo]);

    const flushBufferedUpdates = () => {
        setMultiPV(updateBuffer.current);
        updateBuffer.current = [];
    };

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
                            updateBuffer.current.push({
                                line: parsed,
                                nodeId: currentNodeRef.current.getMoveHash(),
                            });
                        }
                    }

                    if (line.startsWith("bestmove")) {
                        flushBufferedUpdates();
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
        multiPV,
        depth,
        setDepth,
        setPositionAndGo,
        terminate: () => engineRef.current?.terminate(),
    };
};
