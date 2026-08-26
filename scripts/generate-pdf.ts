import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import http from "node:http";
import { VARIANTS, type ResumeVariant } from "../src/data/variants.ts";
import { assertPdfPageCount } from "./verify-outputs.ts";
import { launchBrowser, type Browser } from "./lib/chromium.ts";
import { createStaticHandler } from "./lib/static-server.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");
const downloadsDir = path.join(distDir, "downloads");

function startStaticServer(baseDir: string): Promise<{ server: http.Server; port: number }> {
	return new Promise((resolve, reject) => {
		const server = http.createServer(createStaticHandler(baseDir));

		server.listen(0, "127.0.0.1", () => {
			const addr = server.address();
			if (typeof addr === "object" && addr !== null) {
				resolve({ server, port: addr.port });
			} else {
				reject(new Error("Failed to get server address"));
			}
		});

		server.on("error", reject);
	});
}

export async function generatePdfs(): Promise<void> {
	if (!fs.existsSync(distDir)) {
		throw new Error(`Build output directory not found at ${distDir}. Please run 'astro build' first.`);
	}

	if (!fs.existsSync(downloadsDir)) {
		fs.mkdirSync(downloadsDir, { recursive: true });
	}

	console.log("[pdf] Starting static server for dist/...");
	const { server, port } = await startStaticServer(distDir);
	console.log(`[pdf] Server running on http://127.0.0.1:${port}`);

	let browser: Browser | null = null;
	try {
		browser = await launchBrowser("pdf");
		const page = await browser.newPage({
			viewport: { width: 1280, height: 960 },
			deviceScaleFactor: 2,
		});

		const variantsToGenerate = Object.keys(VARIANTS) as ResumeVariant[];

		for (const vKey of variantsToGenerate) {
			const routePath = vKey === "fullstack" ? "/print/resume/" : `/print/resume/${vKey}/`;
			const targetUrl = `http://127.0.0.1:${port}${routePath}`;
			const outPdfPath = path.join(downloadsDir, `resume-${vKey}.pdf`);

			console.log(`[pdf] Generating: ${vKey} -> ${outPdfPath}`);
			await page.goto(targetUrl, { waitUntil: "load" });
			await page.evaluate(() => document.fonts.ready);
			await page.emulateMedia({ media: "print" });

			await page.pdf({
				path: outPdfPath,
				format: "A4",
				printBackground: true,
				preferCSSPageSize: true,
				margin: {
					top: "0mm",
					bottom: "0mm",
					left: "0mm",
					right: "0mm",
				},
			});

			const expectedPages = VARIANTS[vKey].pdfPages;
			assertPdfPageCount(outPdfPath, expectedPages);
			const actualPages = expectedPages;

			console.log(`[pdf] Successfully generated (${actualPages}p): ${outPdfPath}`);
		}
	} finally {
		if (browser) {
			await browser.close();
		}
		server.close();
	}
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	generatePdfs().catch((err) => {
		console.error("[pdf] Error generating PDFs:", err);
		process.exit(1);
	});
}
