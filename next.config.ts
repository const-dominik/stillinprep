import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    additionalData: `@use "@/app/variables" as v;`,
  },
};

export default nextConfig;
