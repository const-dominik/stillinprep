import { Stockfish } from "./types";

declare module "stockfish.wasm" {
    export default function Stockfish(): Stockfish;
}
