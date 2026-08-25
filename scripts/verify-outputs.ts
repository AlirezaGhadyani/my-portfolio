import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { VARIANTS, type ResumeVariant } from "../src/data/variants.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

export function getPdfPageCount(pdfPath: string): number {
	if (!fs.existsSync(pdfPath)) {
		throw new Error(`PDF file not found: ${pdfPath}`);
	}
	const content = fs.readFileSync(pdfPath, "utf-8");
	const matches = content.match(/\/Type\s*\/Page[^s]/g);
	return matches ? matches.length : 0;
}

export function assertPdfPageCount(pdfPath: string, expectedPages: number): void {
	const actualPages = getPdfPageCount(pdfPath);
	if (actualPages !== expectedPages) {
		throw new Error(
			`PDF page count mismatch for ${path.basename(pdfPath)}: expected ${expectedPages}, got ${actualPages}`,
		);
	}
}

export function verifyAllPdfs(downloadsDir = path.join(projectRoot, "public", "downloads")): void {
	const variants = Object.keys(VARIANTS) as ResumeVariant[];
	console.log(`[verify-outputs] Verifying ${variants.length} PDF outputs in ${downloadsDir}...`);

	for (const vKey of variants) {
		const expected = VARIANTS[vKey].pdfPages;
		const pdfPath = path.join(downloadsDir, `resume-${vKey}.pdf`);
		assertPdfPageCount(pdfPath, expected);
		console.log(`[verify-outputs] ✓ resume-${vKey}.pdf matches expected ${expected} page(s)`);
	}
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	try {
		const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : undefined;
		verifyAllPdfs(targetDir);
		console.log("[verify-outputs] All PDF assertions passed.");
	} catch (err) {
		console.error("[verify-outputs] Verification failed:", err);
		process.exit(1);
	}
}
