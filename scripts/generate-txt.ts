import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resumeData } from "../src/data/resume.ts";
import { applyVariant, type ResumeVariant } from "../src/data/variants.ts";
import { certificationLine, dateRange, duration, educationLine, orderedExperience, skillLine } from "../src/domain/present.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const downloadsDir = path.join(projectRoot, "dist", "downloads");

export function generatePlainTextResume(variantKey: ResumeVariant = "ats"): string {
	const data = applyVariant(resumeData, variantKey);
	const { identity, experience, skills, education, certifications, projects, documentTitle, activeSummary } = data;

	const lines: string[] = [];

	// Header — plain ASCII by construction; the em/en dashes below are normalized at the end.
	lines.push(`${identity.name} — ${documentTitle}`);
	lines.push(`Location: ${identity.location}`);
	lines.push(`Email:    ${identity.email}`);
	if (identity.phone) lines.push(`Phone:    ${identity.phone}`);
	lines.push(`Website:  ${identity.website}`);
	const printLinks = identity.links.filter((l) => !l.printHidden).map((l) => `${l.label}: ${l.url}`);
	if (printLinks.length > 0) {
		lines.push(`Links:    ${printLinks.join(" | ")}`);
	}
	lines.push("");

	// Summary
	lines.push("SUMMARY");
	lines.push(activeSummary);
	lines.push("");

	// Technical Skills
	lines.push("TECHNICAL SKILLS");
	for (const cat of skills) {
		lines.push(`${cat.name}: ${skillLine(cat)}`);
	}
	lines.push("");

	// Experience
	lines.push("EXPERIENCE");
	for (const exp of orderedExperience(experience)) {
		const dates = dateRange(exp.startDate, exp.endDate);
		lines.push(`${exp.role} | ${exp.company} | ${exp.location}`);
		lines.push(`Dates: ${dates} (${duration(exp.startDate, exp.endDate)})`);
		lines.push(exp.summary);
		for (const h of exp.highlights) {
			lines.push(`  * ${h}`);
		}
		if (exp.technologies.length > 0) {
			lines.push(`Technologies: ${exp.technologies.join(", ")}`);
		}
		lines.push("");
	}

	// Projects
	if (projects.length > 0) {
		lines.push("SELECTED PROJECTS");
		for (const proj of projects) {
			lines.push(`${proj.title} — ${proj.role}`);
			if (proj.liveUrl) lines.push(`Live: ${proj.liveUrl}`);
			if (proj.githubUrl) lines.push(`Code: ${proj.githubUrl}`);
			lines.push(proj.description);
			if (proj.impactMetrics && proj.impactMetrics.length > 0) {
				lines.push(`Impact: ${proj.impactMetrics.join(" | ")}`);
			}
			lines.push(`Technologies: ${proj.technologies.join(", ")}`);
			lines.push("");
		}
	}

	// Education
	lines.push("EDUCATION");
	for (const edu of education) {
		const display = educationLine(edu);
		lines.push(display.heading);
		lines.push(`Dates: ${display.dates}`);
		if (display.honors) lines.push(`Honors: ${display.honors}`);
		lines.push("");
	}

	// Certifications
	if (certifications && certifications.length > 0) {
		lines.push("CERTIFICATIONS");
		for (const cert of certifications) {
			const display = certificationLine(cert);
			lines.push(`${display.heading} (${display.date})`);
		}
		lines.push("");
	}

	return lines.join("\n").replace(/[–—]/g, "-");
}

export function writePlainTextResumes(): void {
	if (!fs.existsSync(downloadsDir)) {
		fs.mkdirSync(downloadsDir, { recursive: true });
	}

	const atsContent = generatePlainTextResume("ats");
	const atsPath = path.join(downloadsDir, "resume-ats.txt");
	fs.writeFileSync(atsPath, atsContent, "utf-8");
	console.log(`[txt] Generated: ${atsPath}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	writePlainTextResumes();
}
