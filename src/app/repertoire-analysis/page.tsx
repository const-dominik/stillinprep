import RepertoireAnalysis from "@/components/repertoire-analysis/repertoire-analysis-page";
import { getRepertoires } from "@/lib/actions/repertoire";

const ServerComponent = async () => {
    const repertoires = await getRepertoires();

    if (!repertoires.success || !repertoires.value)
        throw new Error("Repertire problem");

    return <RepertoireAnalysis repertoires={repertoires.value["owned"]} />;
};

export default ServerComponent;
