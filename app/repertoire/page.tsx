import RepertoireList from "../_components/repertoires/RepertoireList";
import { getRepertoires } from "../actions/repertoire";

const Content = async () => {
    const repertoires = await getRepertoires();

    if (!repertoires) {
        throw new Error(
            "Something wrong with db - no repertoires returned, probably instance paused :("
        );
    }

    return <RepertoireList repertoires={repertoires} />;
};

export default Content;
