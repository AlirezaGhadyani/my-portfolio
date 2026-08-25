import { describe, expect, it } from "vitest";
import { VARIANTS, applyVariant } from "./variants.ts";
import { ResumeDataSchema } from "./schema.ts";
import { resumeData } from "./resume.ts";

const data = ResumeDataSchema.parse(resumeData);

describe("VariantConfig definitions", () => {
	it("declares all four expected variants", () => {
		expect(Object.keys(VARIANTS).sort()).toEqual(["ats", "brief", "frontend", "fullstack"].sort());
	});

	it("exposes unique labels and pdf page counts", () => {
		expect(VARIANTS.fullstack.pdfPages).toBe(2);
		expect(VARIANTS.brief.pdfPages).toBe(1);
		expect(VARIANTS.ats.pdfPages).toBe(1);
		expect(VARIANTS.frontend.label).toContain("Frontend");
	});
});

describe("applyVariant", () => {
	it("returns a valid ResumeData-shaped payload", () => {
		const variant = applyVariant(data, "fullstack");
		expect(ResumeDataSchema.safeParse(variant).success).toBe(true);
	});

	it("stamps the variant id and a document title matching jobTitle", () => {
		const variant = applyVariant(data, "frontend");
		expect(variant.variant).toBe("frontend");
		expect(variant.documentTitle).toBe(VARIANTS.frontend.jobTitle);
	});

	it("ensures jobTitle is a plausible job title and never equals UI label for ats/brief", () => {
		for (const vKey of Object.keys(VARIANTS) as (keyof typeof VARIANTS)[]) {
			const config = VARIANTS[vKey];
			expect(config.jobTitle).toMatch(/Engineer|Developer/);
			expect(config.shortLabel).toBeDefined();
			expect(config.shortLabel.length).toBeLessThanOrEqual(10);
		}
		const ats = applyVariant(data, "ats");
		const brief = applyVariant(data, "brief");
		expect(ats.documentTitle).not.toBe(VARIANTS.ats.label);
		expect(brief.documentTitle).not.toBe(VARIANTS.brief.label);
	});

	it("limits projects to the variant maxProjects", () => {
		const brief = applyVariant(data, "brief");
		expect(brief.projects.length).toBeLessThanOrEqual(VARIANTS.brief.maxProjects);
		expect(brief.projects).toHaveLength(VARIANTS.brief.maxProjects);
	});

	it("moves featured skills to the front of their category", () => {
		const variant = applyVariant(data, "fullstack");
		const cat = variant.skills.find((c) => c.skills.some((s) => s.name === "TypeScript"))!;
		const present = VARIANTS.fullstack.featuredSkillsFirst.filter((name) =>
			cat.skills.some((skill) => skill.name === name),
		);
		expect(cat.skills.map((skill) => skill.name).filter((name) => present.includes(name))).toEqual(present);
	});

	it("uses the short summary for one-page variants", () => {
		const brief = applyVariant(data, "brief");
		const ats = applyVariant(data, "ats");
		expect(brief.summary.full).toBe(brief.summary.short);
		expect(ats.summary.full).toBe(ats.summary.short);
	});

	it("keeps the full summary for two-page variants", () => {
		const fullstack = applyVariant(data, "fullstack");
		expect(fullstack.summary.full).toBe(data.summary.full);
	});

	it("drops excluded sections for the brief variant", () => {
		const brief = applyVariant(data, "brief");
		expect(brief.certifications).toBeUndefined();
		const fullstack = applyVariant(data, "fullstack");
		expect(fullstack.certifications).toBeDefined();
	});

	it("never mutates the canonical experience history", () => {
		const variant = applyVariant(data, "brief");
		expect(variant.experience).toEqual(data.experience);
	});
});
