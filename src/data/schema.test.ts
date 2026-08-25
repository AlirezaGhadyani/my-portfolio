import { describe, expect, it } from "vitest";
import { ResumeDataSchema, SkillCategorySchema, ProjectSchema, ExperienceItemSchema } from "./schema.ts";
import { resumeData } from "./resume.ts";

const base = resumeData;

describe("ResumeDataSchema", () => {
	it("parses the canonical resumeData fixture", () => {
		const parsed = ResumeDataSchema.safeParse(base);
		expect(parsed.success).toBe(true);
	});

	it("outputs populated required identity fields", () => {
		const parsed = ResumeDataSchema.parse(base);
		expect(parsed.experience.length).toBeGreaterThan(0);
		expect(parsed.projects.length).toBeGreaterThan(0);
		expect(parsed.skills.length).toBeGreaterThan(0);
		expect(parsed.education.length).toBeGreaterThan(0);
	});

	it("rejects an invalid email", () => {
		const bad = { ...base, identity: { ...base.identity, email: "not-an-email" } };
		const result = ResumeDataSchema.safeParse(bad);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.path[0]).toBe("identity");
		}
	});

	it("rejects a missing required company on experience", () => {
		const bad = { ...base, experience: [{ ...base.experience[0], company: undefined }] };
		expect(ResumeDataSchema.safeParse(bad).success).toBe(false);
	});

	it("rejects an invalid project URL", () => {
		const bad = { ...base, projects: [{ ...base.projects[0], liveUrl: "not a url" }] };
		expect(ResumeDataSchema.safeParse(bad).success).toBe(false);
	});
});

describe("ExperienceItemSchema", () => {
	it("defaults tier to primary and featured to true", () => {
		const parsed = ExperienceItemSchema.parse({
			id: "x",
			company: "Acme",
			location: "UK",
			role: "Engineer",
			startDate: "2020-01",
			summary: "s",
			highlights: ["a"],
			technologies: [],
		});
		expect(parsed.tier).toBe("primary");
		expect(parsed.featured).toBe(true);
	});
});

describe("ProjectSchema", () => {
	it("defaults tier to notable and featured to false", () => {
		const parsed = ProjectSchema.parse({
			slug: "x",
			title: "T",
			subtitle: "S",
			description: "D",
			role: "R",
			technologies: [],
		});
		expect(parsed.tier).toBe("notable");
		expect(parsed.featured).toBe(false);
	});
});

describe("SkillCategorySchema", () => {
	it("validates a category with nested skills", () => {
		const parsed = SkillCategorySchema.parse({
			name: "Languages",
			skills: [{ name: "TypeScript", level: "expert", highlighted: true }],
		});
		expect(parsed.skills[0].level).toBe("expert");
		expect(parsed.skills[0].highlighted).toBe(true);
	});

	it("rejects an unknown skill level", () => {
		const bad = { name: "Languages", skills: [{ name: "x", level: "master" }] };
		expect(SkillCategorySchema.safeParse(bad).success).toBe(false);
	});
});
