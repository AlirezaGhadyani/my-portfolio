import type { Certification, EducationItem, ExperienceItem, Project, SkillCategory } from "../data/schema.ts";

const monthPattern = /^(\d{4})-(0[1-9]|1[0-2])$/;

/** Formats a YYYY-MM value as a stable, human-readable month and year. */
export function monthYear(value: string): string {
	const match = monthPattern.exec(value);
	if (!match) throw new Error(`Invalid month value: ${value}`);

	const [, year, month] = match;
	return new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric", timeZone: "UTC" }).format(
		new Date(Date.UTC(Number(year), Number(month) - 1, 1)),
	);
}

/** Formats an open or closed date range with one consistent separator. */
export function dateRange(start: string, end?: string): string {
	return `${monthYear(start)} – ${end ? monthYear(end) : "Present"}`;
}

/** Calculates a human-readable duration between two YYYY-MM dates (e.g., "2 yrs 1 mo"). */
export function duration(start: string, end?: string): string {
	const [, startYear, startMonth] = monthPattern.exec(start) ?? [];
	if (!startYear || !startMonth) throw new Error(`Invalid start date: ${start}`);

	let endYear: number;
	let endMonth: number;
	if (end) {
		const [, ey, em] = monthPattern.exec(end) ?? [];
		if (!ey || !em) throw new Error(`Invalid end date: ${end}`);
		endYear = Number(ey);
		endMonth = Number(em);
	} else {
		const now = new Date();
		endYear = now.getUTCFullYear();
		endMonth = now.getUTCMonth() + 1;
	}

	let months = (endYear - Number(startYear)) * 12 + (endMonth - Number(startMonth)) + 1;
	if (months < 0) months = 0;

	const years = Math.floor(months / 12);
	const remaining = months % 12;

	if (years === 0) return `${remaining} mo${remaining !== 1 ? "s" : ""}`;
	if (remaining === 0) return `${years} yr${years !== 1 ? "s" : ""}`;
	return `${years} yr${years !== 1 ? "s" : ""} ${remaining} mo${remaining !== 1 ? "s" : ""}`;
}

/** Primary experience first, then newest start date, without mutating the input. */
export function orderedExperience(items: ExperienceItem[]): ExperienceItem[] {
	return [...items].sort((a, b) => {
		if (a.tier !== b.tier) return a.tier === "primary" ? -1 : 1;
		return b.startDate.localeCompare(a.startDate);
	});
}

/** Orders projects by taxonomy, then title, without mutating the input. */
export function orderedProjects(items: Project[]): Project[] {
	const orderRank = { flagship: 0, notable: 1, experiment: 2 } as const;
	return [...items].sort((a, b) => orderRank[a.tier] - orderRank[b.tier] || a.title.localeCompare(b.title));
}

/** Joins a skill category using the canonical separator. */
export function skillLine(category: SkillCategory): string {
	return category.skills.map((skill) => skill.name).join(", ");
}

export function educationLine(item: EducationItem): { heading: string; dates: string; honors?: string } {
	return {
		heading: `${item.degree} in ${item.field} — ${item.institution}`,
		dates: dateRange(item.startDate, item.endDate),
		...(item.honors ? { honors: item.honors } : {}),
	};
}

export function certificationLine(item: Certification): { heading: string; date: string } {
	return {
		heading: `${item.name} — ${item.issuer}`,
		date: monthYear(item.date),
	};
}
