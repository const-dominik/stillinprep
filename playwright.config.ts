import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./__tests__/e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: "html",
    use: {
        baseURL: "http://localhost:8080",
        trace: "on-first-retry",
    },

    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },

        {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
        },

        {
            name: "safari",
            use: { ...devices["Desktop Safari"] },
        },
    ],

    webServer: {
        command: "next dev --turbopack -p 8080",
        url: "http://127.0.0.1:8080",
        reuseExistingServer: false,
    },
});
