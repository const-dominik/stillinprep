import {
    flattenResult,
    getDepth,
    getRatings,
    getTimeControls,
} from "@/components/utils/parseDbResponse";
import { DbRepertoire } from "@/lib/types/backend-types";
import { LiDbAvgRating, RepertoireData } from "@/lib/types/types";
import { createContext, ReactNode, useContext } from "react";

const RepertoireContext = createContext<RepertoireData | null>(null);

export const RepertoireProvider = ({
    children,
    repertoireData,
    repertoireId,
}: {
    children: ReactNode;
    repertoireData: DbRepertoire;
    repertoireId: string;
}) => {
    const { paths, timeControls, ratings, depth } = repertoireData;

    const flattened = flattenResult(paths);
    const parsedTimeControls = getTimeControls(timeControls);
    const parsedRatings: LiDbAvgRating[] = getRatings(ratings);
    const parsedDepth = getDepth(depth);

    return (
        <RepertoireContext.Provider
            value={{
                id: repertoireId,
                paths: flattened,
                timeControls: parsedTimeControls,
                ratings: parsedRatings,
                depth: parsedDepth,
            }}
        >
            {children}
        </RepertoireContext.Provider>
    );
};

export const useRepertoire = () => {
    const context = useContext(RepertoireContext);
    if (!context) {
        throw new Error("Context is null!");
    }

    return context;
};
