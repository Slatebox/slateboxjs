import { defineConfig, devices } from "@playwright/test";

const appUrl = process.env.SLATEBOX_APP_URL || "http://localhost:3000";

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
      name: "meteor-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "node scripts/start-meteor-app-test.mjs",
    url: appUrl,
    reuseExistingServer: process.env.CI !== "true",
    timeout: 5 * 60 * 1000,
  },
});
