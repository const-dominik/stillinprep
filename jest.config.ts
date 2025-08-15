import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
    dir: "./",
});

const config: Config = {
    coverageProvider: "v8",
    modulePathIgnorePatterns: [
        "<rootDir>/__tests__/testing_utils.tsx",
        "<rootDir>/__tests__/test_providers.tsx",
        "<rootDir>/__tests__/e2e",
    ],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^@auth/(.*)$": "<rootDir>/node_modules/@auth/$1",
    },
    setupFiles: ["<rootDir>/__tests__/jest.setup.ts"],
};

export default async () => ({
    ...(await createJestConfig(config)()),
    transformIgnorePatterns: ["<rootDir>/node_modules/(?!next-auth)/"],
    testEnvironment: "jest-fixed-jsdom",
});
