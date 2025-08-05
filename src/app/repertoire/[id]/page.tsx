import Repertoire from "@/components/repertoire/Repertoire";
import { SmallInfoPage } from "@/components/utils/Utils";
import { getRepertoire } from "@/lib/actions/repertoire";
import { protectRoute } from "@/lib/auth";

const Content = async ({ params }: { params: Promise<{ id: string }> }) => {
    await protectRoute();

    const { id } = await params;
    const response = await getRepertoire(id);

    if (!response.success || !response.value) {
        return (
            <SmallInfoPage>
                Page doesn&apos;t exist or you&apos;re unauthorized.
            </SmallInfoPage>
        );
    }

    return <Repertoire repertoireId={id} repertoireData={response.value} />;
};

export default Content;
