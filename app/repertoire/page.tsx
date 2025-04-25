import RepertoireList from "../_components/repertoires/RepertoireList";

const Content = async () => {
    const res = await fetch("http://localhost:3000/api/repertoire", {
        method: "GET",
    });
    const { repertoires } = await res.json();

    if (!repertoires) {
        throw new Error(
            "Something wrong with db - no repertoires returned, probably instance paused :("
        );
    }

    return <RepertoireList repertoires={repertoires} />;
};

export default Content;
