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

    return new Response(JSON.stringify({ success: result.success }), {
        status: result.success ? 200 : 500,
        headers: { "Content-Type": "application/json" },
    });
};

export { keepDbAlive as GET };
