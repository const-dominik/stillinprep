import { getRepertoire } from "@/app/actions/repertoire";
import ChildComponent from "./ChildComponent";
import { MoveSchema } from "@/app/actions/schemas";
import { z } from "zod";

type Paths = Awaited<ReturnType<typeof getRepertoire>>;
type MoveNode = z.infer<typeof MoveSchema>;
type PathNodes = MoveNode["properties"][];

const flattenResult = (paths: Paths) =>
    paths!.map((path) =>
        // this reduce just returns for each path it's simple flat version - list of nodes from root to leaf
        path.segments.reduce<PathNodes>(
            (arr, segment) => {
                arr.push(segment.end.properties);

                return arr;
            },
            [] as unknown as PathNodes
        )
    );

const Content = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const result = await getRepertoire(id);
    if (!result) {
        throw new Error("no results for repertoire");
    }

    const flattened = flattenResult(result);

    return <ChildComponent repertoireId={id} segments={flattened} />;
};

export default Content;
