import { WindowElement } from "@/components/utils/component/Utils";
import {
    DbRepertoireList,
    ServerActionResponse,
} from "@/lib/types/backend-types";
import { ReactNode } from "react";

export const RepertoiresFetcher = async ({
    title,
    fetcher,
    children,
}: {
    title: string;
    fetcher: () => ServerActionResponse<DbRepertoireList>;
    children: (list: DbRepertoireList) => ReactNode;
}) => {
    const repertoires = await fetcher();

    if (!repertoires.success || !repertoires.value) {
        return (
            <WindowElement title={title}>
                Sorry, something went wrong while fetching repertoires.
            </WindowElement>
        );
    }

    return (
        <WindowElement title={title}>
            {children(repertoires.value)}
        </WindowElement>
    );
};

export default RepertoiresFetcher;
