import type { ResumeData, SkillCategory } from "./schema.ts";

export type ResumeVariant = "fullstack" | "frontend" | "ats" | "brief";

export interface VariantConfig {
	id: ResumeVariant;
	/** Human label for the variant itself, e.g. "Standard ATS Format". UI only. */
	label: string;
	/** Compact switcher text, e.g. "ATS". Never derived from `label`. */
	shortLabel: string;
	/** The professional title printed on the document. Never a config label. */
	jobTitle: string;
	pdfPages: 1 | 2;
	summaryOverride: "short" | "full";
	featuredSkillsFirst: string[];
	maxProjects: number;
	excludedSections?: "certifications"[];
}

export const VARIANTS: Record<ResumeVariant, VariantConfig> = {
	fullstack: {
		id: "fullstack",
		label: "Full-Stack Software Engineer",
		shortLabel: "Full-Stack",
		jobTitle: "Full-Stack Software Engineer",
		pdfPages: 2,
		summaryOverride: "full",
		featuredSkillsFirst: ["TypeScript", "React", "Node.js", "PostgreSQL", "Astro", "Tailwind CSS"],
		maxProjects: 6,
	},
	frontend: {
		id: "frontend",
		label: "Senior Frontend / UI Engineer",
		shortLabel: "Frontend",
		jobTitle: "Senior Frontend / UI Engineer",
		pdfPages: 2,
		summaryOverride: "full",
		featuredSkillsFirst: ["React", "Next.js", "Astro", "TypeScript", "Tailwind CSS", "Web Performance"],
		maxProjects: 6,
	},
	brief: {
		id: "brief",
		label: "One-Page Executive Summary",
		shortLabel: "1-Page",
		jobTitle: "Full-Stack Software Engineer",
		pdfPages: 1,
		summaryOverride: "short",
		featuredSkillsFirst: ["Architecture", "TypeScript", "Full-Stack", "Performance"],
		maxProjects: 0,
		excludedSections: ["certifications"],
	},
	ats: {
		id: "ats",
		label: "Standard ATS Format",
		shortLabel: "ATS",
		jobTitle: "Full-Stack Software Engineer",
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
	activeSummary: string;
}

function orderSkills(categories: SkillCategory[], featuredFirst: string[]): SkillCategory[] {
	return categories.map((category) => {
		const featured = category.skills.filter((skill) => featuredFirst.includes(skill.name));
		const rest = category.skills.filter((skill) => !featuredFirst.includes(skill.name));
		return { ...category, skills: [...featured, ...rest] };
	});
}

export function applyVariant(data: ResumeData, variantId: ResumeVariant): VariantResume {
	const variant = VARIANTS[variantId];
	const skillsList = orderSkills(data.skills, variant.featuredSkillsFirst);
	const projectRank = { flagship: 0, notable: 1, experiment: 2 } as const;

	const result: ResumeData = {
		...data,
		skills: skillsList,
		projects: [...data.projects]
			.sort((a, b) => projectRank[a.tier] - projectRank[b.tier] || a.title.localeCompare(b.title))
			.slice(0, variant.maxProjects),
	};

	if (variant.excludedSections?.includes("certifications")) {
		const { certifications, ...withoutCertifications } = result;
		void certifications;
		return {
			...withoutCertifications,
			variant: variantId,
			documentTitle: variant.jobTitle,
			activeSummary: variant.summaryOverride === "short" ? data.summary.short : data.summary.full,
		};
	}

	return {
		...result,
		variant: variantId,
		documentTitle: variant.jobTitle,
		activeSummary: variant.summaryOverride === "short" ? data.summary.short : data.summary.full,
	};
}
