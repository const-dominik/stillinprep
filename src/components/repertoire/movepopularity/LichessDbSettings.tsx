import { updateRepertoireField } from "@/lib/actions/repertoire";
import useChange from "@/lib/hooks/useChange";
import {
    LiDbAvgRating,
    MovePopualritySettings,
    TimeControl,
} from "@/lib/types/types";
import { liRatingsAvgs, timeControlToIcon, toggleArrayItem } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
import styles from "./styles/LichessDbSettings.module.scss";

type LichessDbSettingsProps = {
    settings: MovePopualritySettings;
    setSettings: Dispatch<SetStateAction<MovePopualritySettings>>;
    repertoireId: string;
};

const isSingleItem = <T,>(item: T, arr: T[]) =>
    arr.length === 1 && arr.includes(item);

const LichessDbSettings = ({
    settings,
    setSettings,
    repertoireId,
}: LichessDbSettingsProps) => {
    useChange(() => {
        updateRepertoireField(
            repertoireId,
            "timeControls",
            settings.timeControls.join(",")
        );
    }, [settings.timeControls, repertoireId]);

    useChange(() => {
        updateRepertoireField(
            repertoireId,
            "ratings",
            settings.ratings.join(",")
        );
    }, [settings.ratings, repertoireId]);

    const handleChangeTimeControls = (control: TimeControl) => {
        setSettings((prev) => {
            if (isSingleItem(control, prev.timeControls)) return prev;

            return {
                ...prev,
                timeControls: toggleArrayItem(control, prev.timeControls),
            };
        });
    };

    const handleChangeRatingsControls = (rating: LiDbAvgRating) => {
        setSettings((prev) => {
            if (isSingleItem(rating, prev.ratings)) return prev;

            return {
                ...prev,
                ratings: toggleArrayItem(rating, prev.ratings),
            };
        });
    };

    return (
        <div className={styles["popularity-settings"]}>
            <div className={styles["settings-line"]}>
                <div className={styles["settings-line-header"]}>
                    Include time controls:
                </div>
                <div className={styles["popularity-settings-options"]}>
                    {Object.entries(timeControlToIcon).map(
                        ([control, Icon]) => {
                            const classes = [styles["svg-container"]];
                            if (
                                settings.timeControls.includes(
                                    control as TimeControl
                                )
                            ) {
                                classes.push(styles["time-control-active"]);
                            }

                            return (
                                <div
                                    className={classes.join(" ")}
                                    key={control}
                                    onClick={() =>
                                        handleChangeTimeControls(
                                            control as TimeControl
                                        )
                                    }
                                >
                                    <Icon />
                                </div>
                            );
                        }
                    )}
                </div>
            </div>
            <div className={styles["settings-line"]}>
                <div className={styles["settings-line-header"]}>
                    Include players with avg. ratings of:
                </div>
                <div className={styles["popularity-settings-options"]}>
                    {liRatingsAvgs.map((rating) => {
                        const classes = [styles["rating-container"]];
                        if (settings.ratings.includes(rating)) {
                            classes.push(styles["time-control-active"]);
                        }

                        return (
                            <div
                                className={classes.join(" ")}
                                key={rating}
                                onClick={() =>
                                    handleChangeRatingsControls(rating)
                                }
                            >
                                <span className={styles["rating-option"]}>
                                    {rating === 2300 ? "2300+" : rating}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default LichessDbSettings;
