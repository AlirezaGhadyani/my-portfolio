import { describe, expect, it } from "vitest";
import {
	certificationLine,
	dateRange,
	educationLine,
	monthYear,
	orderedExperience,
	orderedProjects,
	skillLine,
} from "./present.ts";

describe("presentation adapter", () => {
	it("formats month values and open-ended ranges", () => {
		expect(monthYear("2024-01")).toBe("Jan 2024");
		expect(dateRange("2021-06", "2023-12")).toBe("Jun 2021 – Dec 2023");
		expect(dateRange("2024-01")).toBe("Jan 2024 – Present");
	});

	it("rejects malformed month values", () => {
		expect(() => monthYear("2024-13")).toThrow();
		expect(() => monthYear("not-a-date")).toThrow();
	});

	it("preserves stable ordering policies", () => {
		const experience = [
			{ id: "secondary", tier: "secondary", startDate: "2025-01" },
			{ id: "primary-old", tier: "primary", startDate: "2020-01" },
			{ id: "primary-new", tier: "primary", startDate: "2024-01" },
		] as never[];
		expect(orderedExperience(experience).map((item) => item.id)).toEqual(["primary-new", "primary-old", "secondary"]);

		const projects = [
			{ slug: "z", title: "Zed", tier: "notable" },
			{ slug: "a", title: "Alpha", tier: "flagship" },
			{ slug: "b", title: "Beta", tier: "notable" },
		] as never[];
		expect(orderedProjects(projects).map((item) => item.slug)).toEqual(["a", "b", "z"]);
	});

	it("formats education, certification, and skills", () => {
		expect(
			skillLine({
				name: "Languages",
				skills: [
					{ name: "TypeScript", highlighted: false },
					{ name: "React", highlighted: false },
				],
			}),
		).toBe("TypeScript, React");
		expect(
			educationLine({
				degree: "MEng",
				field: "Computer Science",
				institution: "Cambridge",
				startDate: "2015-09",
				endDate: "2019-06",
			}),
		).toEqual({
			heading: "MEng in Computer Science — Cambridge",
			dates: "Sept 2015 – Jun 2019",
		});
		expect(certificationLine({ name: "AWS", issuer: "Amazon", date: "2023-04" })).toEqual({
			heading: "AWS — Amazon",
			date: "Apr 2023",
		});
	});
});
