import RepertoireList from "@/components/repertoires-management/RepertoireList";
import { SmallInfoPage } from "@/components/utils/Utils";
import { getRepertoires } from "@/lib/actions/repertoire";
import { protectRoute } from "@/lib/auth";

const Content = async () => {
    await protectRoute();
    try {
        const response = await getRepertoires();

        if (!response.success || !response.value) {
            return <SmallInfoPage>Sorry. Something went wrong.</SmallInfoPage>;
        }

        return <RepertoireList allRepertoires={response.value} />;
    } catch (e) {
        console.log(e);
        throw new Error(
            "Something wrong with db - no repertoires returned, probably instance paused :("
        );
    }
};

export default Content;
