import { Paths, Repertoire } from "./types";

export type DbRepertoiresResponse = Promise<Repertoire[]>;
export type DbRepertoireResponse = Promise<DbRepertoire | undefined>;
export type DbRepertoire = {
    paths: Paths;
    timeControls: string | null;
    ratings: string | null;
    depth: string | null;
};
