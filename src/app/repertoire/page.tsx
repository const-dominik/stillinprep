import RepertoireList from "@/components/repertoires-management/RepertoireList";
import { SmallInfoPage } from "@/components/utils/Utils";
import { getRepertoires } from "@/lib/actions/repertoire";
import { auth } from "@/lib/auth";

const Content = async () => {
    const session = await auth();

    const response = await getRepertoires();

    if (!response.success || !response.value || !session) {
        return <SmallInfoPage>Sorry. Something went wrong.</SmallInfoPage>;
    }

    return (
        <RepertoireList allRepertoires={response.value} user={session.user} />
    );
};

export default Content;
