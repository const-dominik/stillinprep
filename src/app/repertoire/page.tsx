import RepertoireList from "@/components/repertoires-management/RepertoireList";
import { getRepertoires } from "@/lib/actions/repertoire";
import { protectRoute } from "@/lib/auth";

const Content = async () => {
    await protectRoute();
    try {
        const repertoires = await getRepertoires();

        return <RepertoireList repertoires={repertoires} />;
    } catch (e) {
        console.log(e);
        throw new Error(
            "Something wrong with db - no repertoires returned, probably instance paused :("
        );
    }
};

export default Content;
