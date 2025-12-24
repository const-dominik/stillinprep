import { z } from "zod/v4";
import {
    DbUserSchema,
    OwnedRepertoireData,
    PublicRepertoireData,
    SharedRepertoireData,
} from "../schema";
import { Paths, Repertoire } from "./types";

export type DbRepertoiresResponse = Promise<Repertoire[]>;
export type DbRepertoireResponse = Promise<DbRepertoire | undefined>;
export type DbRepertoire = {
    paths: Paths;
    timeControls: string | null;
    ratings: string | null;
    depth: string | null;
    color: "white" | "black";
};

export type DbGlobalRepertoire = {
    white: Paths;
    black: Paths;
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
export type DbOwnedRepertoires = z.infer<typeof OwnedRepertoireData>[];
export type DbPublicRepertoires = z.infer<typeof PublicRepertoireData>[];
export type DbSharedRepertoires = z.infer<typeof SharedRepertoireData>[];

export type DbRepertoireList =
    | DbSharedRepertoires
    | DbPublicRepertoires
    | DbOwnedRepertoires;

export type DbRepertoires = {
    owned: z.infer<typeof OwnedRepertoireData>[];
    public: z.infer<typeof PublicRepertoireData>[];
    shared: z.infer<typeof SharedRepertoireData>[];
};
