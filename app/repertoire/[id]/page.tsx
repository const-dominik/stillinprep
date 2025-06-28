import { getRepertoire } from "@/app/actions/repertoire";
import ChildComponent from "./ChildComponent";
import { MoveSchema, PathSchema } from "@/app/actions/schemas";
import { z } from "zod";
import { LiDbAvgRating, TimeControl } from "@/app/types/types";
import { liRatingsAvgs, liTimeControls } from "@/app/utils";

type Paths = z.infer<typeof PathSchema>[];
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

const timeControlGuard = (s: string): s is TimeControl =>
    (liTimeControls as string[]).includes(s);

const ratingsGuard = (rating: number): rating is LiDbAvgRating =>
    (liRatingsAvgs as number[]).includes(rating);

const parseTimeControls = (timeControls: string): TimeControl[] => {
    const timeControlsArr = timeControls.split(",");
    if (timeControlsArr.every((control) => timeControlGuard(control))) {
        return timeControlsArr;
    }

    throw new Error("Unknown time controls!");
};

const parseRatings = (ratings: string): LiDbAvgRating[] => {
    const ratingsArr = ratings.split(",").map((n) => Number(n));
    if (ratingsArr.every((rating) => ratingsGuard(rating))) {
        return ratingsArr;
    }

    throw new Error("Unknown ratings!");
};

const Content = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const result = await getRepertoire(id);

    if (!result) {
        throw new Error("Repertoire doesn't exist.");
    }

    const { timeControls, ratings, depth, paths } = result;

    const flattened = flattenResult(paths);

    const parsedTimeControls: TimeControl[] = (timeControls &&
        parseTimeControls(timeControls)) || ["rapid"];

    const parsedRatings: LiDbAvgRating[] = (ratings &&
        parseRatings(ratings)) || [1700, 1900, 2100];

    const parsedDepth = (depth && Number(depth)) || 15;

    return (
        <ChildComponent
            repertoireId={id}
            segments={flattened}
            timeControls={parsedTimeControls}
            ratings={parsedRatings}
            depth={parsedDepth}
        />
    );
};

export default Content;
