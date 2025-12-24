"use client";

import { Dispatch, SetStateAction } from "react";

import styles from "./styles/GetCreateForm.module.scss";

const FilterForm = ({
    search,
    setSearch,
}: {
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
}) => {
    return (
        <div className={styles["container-form"]}>
            <input
                type="text"
                placeholder="Find repertoire..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles["input"]}
            />
        </div>
    );
};

export default FilterForm;
