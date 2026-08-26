import { defineConfig } from "@playwright/test";

// CI installs the bundled Chromium via `pnpm exec playwright install chromium`.
// Locally the download may be geo-blocked, so fall back to the system Chrome channel
// unless PW_CHANNEL explicitly overrides it.
const channel = process.env.PW_CHANNEL || (process.env.CI ? undefined : "chrome");

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "list",
	use: {
		channel,
		headless: true,
		baseURL: "http://127.0.0.1:4321",
	},
	webServer: {
		command: "pnpm tsx scripts/serve-static.ts 4321",
		port: 4321,
		reuseExistingServer: !process.env.CI,
	},
});
