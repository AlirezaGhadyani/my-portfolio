import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { VARIANTS, type ResumeVariant } from "../src/data/variants.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
import { resumeData } from "../src/data/resume.ts";
import { orderedExperience } from "../src/domain/present.ts";

const caseStudiesDir = path.join(projectRoot, "src", "content", "case-studies");

export function getPdfPageCount(pdfPath: string): number {
	if (!fs.existsSync(pdfPath)) {
		throw new Error(`PDF file not found: ${pdfPath}`);
	}
	const content = fs.readFileSync(pdfPath, "latin1");
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

export function verifyAllPdfs(downloadsDir = path.join(projectRoot, "dist", "downloads")): void {
	const variants = Object.keys(VARIANTS) as ResumeVariant[];
	console.log(`[verify-outputs] Verifying ${variants.length} PDF outputs in ${downloadsDir}...`);

	for (const vKey of variants) {
		const expected = VARIANTS[vKey].pdfPages;
		const pdfPath = path.join(downloadsDir, `resume-${vKey}.pdf`);
		assertPdfPageCount(pdfPath, expected);
		console.log(`[verify-outputs] ✓ resume-${vKey}.pdf matches expected ${expected} page(s)`);
	}
}

function pdfText(pdfPath: string): string {
	return execFileSync("pdftotext", [pdfPath, "-"], { encoding: "utf8" });
}

export function verifyCrossRendererOutputs(distRoot = path.join(projectRoot, "dist")): void {
	const textPath = path.join(distRoot, "downloads", "resume-ats.txt");
	const text = fs.readFileSync(textPath, "utf8");
	const companies = orderedExperience(resumeData.experience).map((item) => item.company);
	const html = fs.readFileSync(path.join(distRoot, "index.html"), "utf8");
	const pdfs = (Object.keys(VARIANTS) as ResumeVariant[]).map((key) =>
		pdfText(path.join(distRoot, "downloads", `resume-${key}.pdf`)),
	);

	if (!fs.existsSync(path.join(distRoot, "og-image.png"))) {
		throw new Error("OG PNG not generated; dist/og-image.png is missing");
	}

	for (const company of companies) {
		if (!html.includes(company) || !text.includes(company) || pdfs.some((pdf) => !pdf.includes(company))) {
			throw new Error(`Company missing from a renderer output: ${company}`);
		}
	}
	for (const output of [html, text, ...pdfs]) {
		const positions = companies.map((company) => output.indexOf(company));
		if (
			positions.some((position) => position < 0) ||
			positions.some((position, index) => index > 0 && position < positions[index - 1])
		) {
			throw new Error("Experience order differs across renderer outputs");
		}
	}
	if (/\b\d{4}-\d{2}\b/.test(text) || pdfs.some((pdf) => /\b\d{4}-\d{2}\b/.test(pdf))) {
		throw new Error("Raw ISO month found in a generated resume output");
	}
	if (
		[...text].some(
			(character) =>
				character.charCodeAt(0) > 0x7e || (character.charCodeAt(0) < 0x20 && character !== "\n" && character !== "\t"),
		)
	) {
		throw new Error("ATS text output is not ASCII");
	}

	const sitemap = fs.readFileSync(path.join(distRoot, "sitemap.xml"), "utf8");
	for (const project of resumeData.projects.filter((item) => item.hasCaseStudy)) {
		if (!fs.existsSync(path.join(projectRoot, "src/content/case-studies", `${project.slug}.md`))) {
			throw new Error(`Missing case study for project: ${project.slug}`);
		}
		if (!sitemap.includes(`/projects/${project.slug}`)) throw new Error(`Missing sitemap route: ${project.slug}`);
	}
	for (const filename of fs.readdirSync(caseStudiesDir).filter((name) => name.endsWith(".md"))) {
		const source = fs.readFileSync(path.join(caseStudiesDir, filename), "utf8");
		const projectSlug = source.match(/^projectSlug:\s*["']?([^"'\n]+)["']?\s*$/m)?.[1];
		if (!projectSlug || !resumeData.projects.some((project) => project.slug === projectSlug)) {
			throw new Error(`Case study references an unknown project: ${filename}`);
		}
	}
	for (const pathname of [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname)) {
		const routePath = pathname === "/" ? "index.html" : `${pathname.replace(/^\//, "").replace(/\/$/, "")}/index.html`;
		if (!fs.existsSync(path.join(distRoot, routePath))) throw new Error(`Sitemap URL has no built route: ${pathname}`);
	}
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	try {
		const targetRoot = process.argv[2] ? path.resolve(process.argv[2]) : path.join(projectRoot, "dist");
		const targetDir = path.join(targetRoot, "downloads");
		verifyAllPdfs(targetDir);
		verifyCrossRendererOutputs(targetRoot);
		console.log("[verify-outputs] All PDF assertions passed.");
	} catch (err) {
		console.error("[verify-outputs] Verification failed:", err);
		process.exit(1);
	}
}
