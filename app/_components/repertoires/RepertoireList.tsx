"use client";

import { redirect } from "next/navigation";
import type { Repertoire } from "../../types";
import styles from "./styles.module.scss";
import AddRepertoire from "./AddRepertoire";
import { useState } from "react";
import Search from "./Search";

const RepertoireList = ({ repertoires }: { repertoires: Repertoire[] }) => {
    const [search, setSearch] = useState("");

    return (
        <div className={styles.container}>
            <div className={styles["repertoires-list"]}>
                <AddRepertoire />
                {repertoires.length && (
                    <Search search={search} setSearch={setSearch} />
                )}
                {!repertoires.length && (
                    <p className={styles["no-repertoires"]}>
                        You don&apos;t have any repertoires.
                    </p>
                )}
                {repertoires
                    .filter(({ name }) =>
                        name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map(({ id, name }) => {
                        return (
                            <div
                                onClick={() => {
                                    redirect(`repertoire/${id}`);
                                }}
                                className={styles["repertoire-element"]}
                                key={id}
                            >
                                {name}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default RepertoireList;
