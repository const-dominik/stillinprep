import Repertoire from "@/components/repertoire/Repertoire";
import { SmallInfoPage } from "@/components/utils/Utils";
import { getRepertoire } from "@/lib/actions/repertoire";
import { protectRoute } from "@/lib/auth";
import { DbRepertoire } from "@/lib/types/backend-types";
import { getBaseDbRepertoire } from "@/lib/utils";

const Content = async ({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ type: "new"; color: "black" | "white" } | null>;
}) => {
    await protectRoute();

    const { id } = await params;
    const searchParamsValue = await searchParams;

    let repertoireData: DbRepertoire;

    if (searchParamsValue && searchParamsValue.type === "new") {
        repertoireData = getBaseDbRepertoire(searchParamsValue.color);
    } else {
        const response = await getRepertoire(id);

        if (!response.success || !response.value) {
            return (
                <SmallInfoPage>
                    Page doesn&apos;t exist or you&apos;re unauthorized.
                </SmallInfoPage>
            );
        }
        repertoireData = response.value;
    }

    return <Repertoire repertoireId={id} repertoireData={repertoireData!} />;
};

export default Content;
