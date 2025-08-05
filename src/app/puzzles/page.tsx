import PuzzlePage from "@/components/puzzles/PuzzlePage";
import { getGlobalRepertoire, getRepertoires } from "@/lib/actions/repertoire";

const Page = async () => {
    // download user repertoires and pass them all?
    const paths = await getGlobalRepertoire();
    const repertoires = await getRepertoires();

    if (
        !paths.success ||
        !paths.value ||
        !repertoires.success ||
        !repertoires.value
    ) {
        throw new Error("Something went wrong!");
    }

    return (
        <PuzzlePage
            paths={paths.value}
            repertoires={repertoires.value["owned"]}
        />
    );
};

export default Page;
