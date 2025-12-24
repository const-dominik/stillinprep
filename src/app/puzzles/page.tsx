"use server";

import PuzzlePage from "@/components/puzzles/PuzzlePage";
import { getSpacedRepetitionData } from "@/lib/actions/puzzles";
import {
    getGlobalRepertoire,
    getOwnedRepertoires,
} from "@/lib/actions/repertoire";

const Page = async () => {
    const pathsPromise = getGlobalRepertoire();
    const repertoriesPromise = getOwnedRepertoires();
    const spacedDataPromise = getSpacedRepetitionData();

    const [paths, repertoires, spacedData] = await Promise.all([
        pathsPromise,
        repertoriesPromise,
        spacedDataPromise,
    ]);

    if (
        !paths.success ||
        !paths.value ||
        !repertoires.success ||
        !repertoires.value ||
        !spacedData.success ||
        !spacedData.value
    ) {
        throw new Error("Something went wrong!");
    }

    return (
        <PuzzlePage
            paths={paths.value}
            repertoires={repertoires.value}
            spacedData={spacedData.value}
        />
    );
};

export default Page;
