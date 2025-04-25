// This is server component - here we'll download the MovesTree from db
// and pass it to ChildComponent - which is client component
// this way we can utilize Next.js SSR properly (I think)

import ChildComponent from "./ChildComponent";

const Content = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    console.log(id);

    // TODO: here, download repertoire with that id from db

    return <ChildComponent />;
};

export default Content;
