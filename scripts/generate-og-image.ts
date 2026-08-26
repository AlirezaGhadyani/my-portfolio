import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { launchBrowser } from "./lib/chromium.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");
const svgPath = path.join(projectRoot, "public", "og-image.svg");
const outPng = path.join(distDir, "og-image.png");

export async function generateOgImage(): Promise<void> {
	if (!fs.existsSync(svgPath)) {
		throw new Error(`OG source SVG not found: ${svgPath}`);
	}
	if (!fs.existsSync(distDir)) {
		fs.mkdirSync(distDir, { recursive: true });
	}

	const browser = await launchBrowser("og");
	try {
		const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
		await page.goto(pathToFileURL(svgPath).href, { waitUntil: "load" });
		await page.locator("svg").screenshot({ path: outPng });
		console.log(`[og] Generated: ${outPng}`);
	} finally {
		await browser.close();
	}
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	generateOgImage().catch((err) => {
		console.error("[og] Error generating OG image:", err);
		process.exit(1);
	});
}
