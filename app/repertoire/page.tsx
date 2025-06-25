import RepertoireList from "../_components/repertoires/RepertoireList";
import { getRepertoires } from "../actions/repertoire";

const Content = async () => {
    try {
        const repertoires = await getRepertoires();

        return <RepertoireList repertoires={repertoires} />;
    } catch {
        throw new Error(
            "Something wrong with db - no repertoires returned, probably instance paused :("
        );
    }
};

export default Content;
