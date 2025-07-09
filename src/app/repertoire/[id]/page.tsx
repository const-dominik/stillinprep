import Repertoire from "@/components/repertoire/Repertoire";
import { getRepertoire } from "@/lib/actions/repertoire";
import { protectRoute } from "@/lib/auth";

const Content = async ({ params }: { params: Promise<{ id: string }> }) => {
    await protectRoute();

    const { id } = await params;
    const result = await getRepertoire(id);

    if (!result) {
        throw new Error("Repertoire doesn't exist.");
    }

    return <Repertoire repertoireId={id} repertoireData={result} />;
};

export default Content;
