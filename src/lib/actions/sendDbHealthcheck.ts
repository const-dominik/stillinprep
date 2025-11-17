import { getNeoSession } from "../neo4j";

export const sendDatabaseHealthcheck = async () => {
    const session = getNeoSession();

    try {
        await session.run("RETURN 1");
        return { success: true };
    } catch {
        return { success: false };
    } finally {
        await session.close();
    }
};
