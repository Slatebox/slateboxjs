import { defineConfig, devices } from "@playwright/test";

const appUrl = process.env.SLATEBOX_APP_URL || "http://localhost:3000";
const browsers = {
  chromium: devices["Desktop Chrome"],
  firefox: devices["Desktop Firefox"],
  webkit: devices["Desktop Safari"],
};
const browser = process.env.SLATEBOX_APP_BROWSER || "chromium";
if (!(browser in browsers)) throw new Error("Choose chromium, firefox, or webkit for SLATEBOX_APP_BROWSER");
const useExternalApp = process.env.SLATEBOX_APP_EXTERNAL === "true";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/app-*.spec.ts",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: "list",
  timeout: 180_000,
  use: {
    baseURL: appUrl,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "meteor-" + browser,
      use: browsers[browser as keyof typeof browsers],
    },
  ],
  webServer: useExternalApp
    ? undefined
    : {
        command: "node scripts/start-meteor-app-test.mjs",
        url: appUrl,
        reuseExistingServer: process.env.CI !== "true",
        timeout: 5 * 60 * 1000,
      },
});
