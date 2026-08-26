import { chromium, type Browser, type LaunchOptions } from "playwright";

const BASE_OPTIONS: LaunchOptions = {
	headless: true,
	args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
};

export type { Browser };

/**
 * Launch Chromium for scripted rendering (PDFs, OG images). Prefers Playwright's
 * bundled Chromium; falls back to the system `chrome` channel when the bundled
 * binary is not installed (e.g. geo-blocked downloads).
 */
export async function launchBrowser(prefix: string): Promise<Browser> {
	try {
		return await chromium.launch(BASE_OPTIONS);
	} catch (err) {
		if (err instanceof Error && /Executable doesn't exist|browserType\.launch/i.test(err.message)) {
			console.warn(`[${prefix}] Bundled Chromium unavailable, using system 'chrome' channel`);
			return await chromium.launch({ ...BASE_OPTIONS, channel: "chrome" });
		}
		throw err;
	}
}
