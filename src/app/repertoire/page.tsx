import RepertoireLists from "@/components/repertoires-management/lists/RepertoireLists";
import { RepertoireNav } from "@/components/utils/component/Utils";

const Content = async () => {
    return (
        <>
            <RepertoireNav backUrl="/" />
            <RepertoireLists />
        </>
    );
};

export default Content;
