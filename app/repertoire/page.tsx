import RepertoireList from "../_components/repertoires/RepertoireList";

const Content = async () => {
    const res = await fetch("http://localhost:3000/api/repertoire", {
        method: "GET",
    });
    const { repertoires } = await res.json();

    return <RepertoireList repertoires={repertoires} />;
};

export default Content;
