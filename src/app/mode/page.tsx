import ModeChoice from "@/components/mode-choice/ModeChoice";
import { protectRoute } from "@/lib/auth";

const Page = async () => {
    await protectRoute();

    return <ModeChoice />;
};

export default Page;
