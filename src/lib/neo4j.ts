import { config } from "dotenv";
import { auth, driver } from "neo4j-driver";

const URI = process.env.NEO4J_URI;
const LOGIN = process.env.NEO4J_USERNAME;
const PASSWORD = process.env.NEO4J_PASSWORD;

if (!URI || !LOGIN || !PASSWORD) {
    config();
}

export const neoDriver = driver(URI!, auth.basic(LOGIN!, PASSWORD!));

export const getNeoSession = () => neoDriver.session();
