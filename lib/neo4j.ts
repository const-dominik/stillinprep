import neo4j from "neo4j-driver";
import dotenv from "dotenv";

const URI = process.env.NEO4J_URI;
const LOGIN = process.env.NEO4J_USERNAME;
const PASSWORD = process.env.NEO4J_PASSWORD;

if (!URI || !LOGIN || !PASSWORD) {
    dotenv.config();
}

const driver = neo4j.driver(URI!, neo4j.auth.basic(LOGIN!, PASSWORD!));

export const getSession = () => driver.session();
