import { z } from "zod/v4";
import { DbUserSchema } from "../schema";
import { Paths, Repertoire } from "./types";

export type DbRepertoiresResponse = Promise<Repertoire[]>;
export type DbRepertoireResponse = Promise<DbRepertoire | undefined>;
export type DbRepertoire = {
    paths: Paths;
    timeControls: string | null;
    ratings: string | null;
    depth: string | null;
};

export type DbUser = z.infer<typeof DbUserSchema>;

export type ServerActionResponse<T> = Promise<
    | {
          success: false;
          error: string;
      }
    | {
          success: true;
          message?: string;
          value?: T;
      }
>;
