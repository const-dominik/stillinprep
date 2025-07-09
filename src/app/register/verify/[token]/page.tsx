import { SmallWindowPage } from "@/components/utils/Utils";
import { verifyEmail } from "@/lib/actions/register";

const Content = async ({ params }: { params: Promise<{ token: string }> }) => {
    const { token } = await params;
    const result = await verifyEmail(token);
    return (
        <SmallWindowPage>
            <div
                style={{
                    margin: "1rem 2rem",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50%",
                }}
            >
                {result.success && "Verified!"}
                {!result.success && `${String(result.error)}`}
            </div>
        </SmallWindowPage>
    );
};

export default Content;
