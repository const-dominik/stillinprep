import RepertoireList from "@/components/repertoires-management/RepertoireList";
import { getRepertoires } from "@/lib/actions/repertoire";
import { auth } from "@/lib/auth";

const Content = async () => {
    const session = await auth();

    const response = await getRepertoires();

    if (!response.success || !response.value || !session) {
        // todo: Suspened this or do something iwth it
        return <div>Sorry. Something went wrong.</div>;
    }

    return (
        <RepertoireList allRepertoires={response.value} user={session.user} />
    );
};

export default Content;
