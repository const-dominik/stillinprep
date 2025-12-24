import { ReactNode } from "react";

type WithParamsProps<T> = {
    params: Promise<T>;
    children: (params: T) => ReactNode;
};

export const WithParams = async <T,>({
    params,
    children,
}: WithParamsProps<T>) => {
    const resolvedParams = await params;
    return <>{children(resolvedParams)}</>;
};
