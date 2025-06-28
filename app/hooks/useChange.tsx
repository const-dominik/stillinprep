import { useEffect, useRef } from "react";

const useChange = (action: Function, dependencyArr: unknown[]) => {
    const initialRenderRef = useRef(true);

    useEffect(() => {
        if (initialRenderRef.current) {
            initialRenderRef.current = false;
            return;
        }

        action();
    }, dependencyArr);
};
export default useChange;
