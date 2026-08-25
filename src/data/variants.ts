import type { ResumeData, SkillCategory } from "./schema.ts";

export type ResumeVariant = "fullstack" | "frontend" | "ats" | "brief";

export interface VariantConfig {
	id: ResumeVariant;
	label: string;
	pdfPages: 1 | 2;
	titleOverride?: string;
	summaryOverride: "short" | "full";
	featuredSkillsFirst: string[];
	maxProjects: number;
	excludedSections?: "certifications"[];
}

export const VARIANTS: Record<ResumeVariant, VariantConfig> = {
	fullstack: {
		id: "fullstack",
		label: "Full-Stack Software Engineer",
		pdfPages: 2,
		summaryOverride: "full",
		featuredSkillsFirst: ["TypeScript", "React", "Node.js", "PostgreSQL", "Astro", "Tailwind CSS"],
		maxProjects: 6,
	},
	frontend: {
		id: "frontend",
		label: "Senior Frontend / UI Engineer",
		pdfPages: 2,
		summaryOverride: "full",
		featuredSkillsFirst: ["React", "Next.js", "Astro", "TypeScript", "Tailwind CSS", "Web Performance"],
		maxProjects: 6,
	},
	brief: {
		id: "brief",
		label: "One-Page Executive Summary",
		pdfPages: 1,
		summaryOverride: "short",
		featuredSkillsFirst: ["Architecture", "TypeScript", "Full-Stack", "Performance"],
		maxProjects: 0,
		excludedSections: ["certifications"],
	},
	ats: {
		id: "ats",
		label: "Standard ATS Format",
		pdfPages: 1,
		summaryOverride: "short",
		featuredSkillsFirst: ["Full-Stack Development", "System Architecture"],
		maxProjects: 0,
		excludedSections: ["certifications"],
	},
};

export interface VariantResume extends ResumeData {
	variant: ResumeVariant;
	documentTitle: string;
}

function orderSkills(categories: SkillCategory[], featuredFirst: string[]): SkillCategory[] {
	return categories.map((category) => {
		const featured = category.skills.filter((skill) => featuredFirst.includes(skill.name));
		const rest = category.skills.filter((skill) => !featuredFirst.includes(skill.name));
		return { ...category, skills: [...featured, ...rest] };
	});
}

function applySummaryOverride(summary: ResumeData["summary"], override: "short" | "full"): ResumeData["summary"] {
	return override === "short" ? { ...summary, full: summary.short } : summary;
}

export function applyVariant(data: ResumeData, variantId: ResumeVariant): VariantResume {
	const variant = VARIANTS[variantId];
	const skillsList = orderSkills(data.skills, variant.featuredSkillsFirst);

	const result: ResumeData = {
		...data,
		summary: applySummaryOverride(data.summary, variant.summaryOverride),
		skills: skillsList,
		projects: data.projects.filter((_, index) => index < variant.maxProjects),
	};

	if (variant.excludedSections?.includes("certifications")) {
		result.certifications = undefined;
	}

	return {
		...result,
		variant: variantId,
		documentTitle: variant.titleOverride ?? variant.label,
	};
}
