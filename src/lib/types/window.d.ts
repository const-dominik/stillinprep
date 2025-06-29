import { Stockfish } from "./types";

declare global {
    interface Window {
        Stockfish(): Stockfish | undefined;
    }
}
