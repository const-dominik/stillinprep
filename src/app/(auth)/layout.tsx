import { SingleWindowPage } from "@/components/utils/component/Utils";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
    return <SingleWindowPage>{children}</SingleWindowPage>;
};

export default Layout;
