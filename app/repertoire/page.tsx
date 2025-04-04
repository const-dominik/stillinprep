// This is server component - here we'll download the MovesTree from db
// and pass it to ChildComponent - which is client component
// this way we can utilize Next.js SSR properly (I think)

import ChildComponent from "./ChildComponent";

const Content = () => {
    return <ChildComponent />;
};

export default Content;
