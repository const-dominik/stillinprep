import { sendDatabaseHealthcheck } from "@/lib/actions/sendDbHealthcheck";
import { NextRequest } from "next/server";

const keepDbAlive = async (request: NextRequest) => {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response("Unauthorized", {
            status: 401,
        });
    }

    const result = await sendDatabaseHealthcheck();

    return Response.json({ success: result.success });
};

export { keepDbAlive as GET };
