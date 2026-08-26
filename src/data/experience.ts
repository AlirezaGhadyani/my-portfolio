import { ExperienceItemSchema } from "./schema.ts";
import type { ExperienceItem } from "./schema.ts";

export const experience: ExperienceItem[] = ExperienceItemSchema.array()
	.min(1)
	.parse([
		{
			id: "telewebion",
			company: "Telewebion",
			location: "Tehran, Tehran Province, Iran",
			role: "Senior Frontend Engineer",
			startDate: "2024-08",
			summary:
				"Leading frontend development for a streaming platform, building performant and accessible user interfaces with modern React tooling.",
			highlights: [
				"Delivered key features for the streaming platform with focus on performance and UX.",
				"Collaborated with cross-functional teams in a hybrid work environment.",
			],
			technologies: [
				"Next.js",
				"React",
				"GraphQL",
				"Turborepo",
			"Module Federation",
			"Micro Frontends",
			"Monorepos",
				"Zustand",
				"Dgraph",
				"Tailwind CSS",
				"Package Development",
				"Semantic Release",
				"CI/CD",
				"GitLab CI",
				"AI Integrations",
			],
			tier: "primary",
		},
		{
			id: "yeganehsoft",
			company: "YeganehSoft",
			location: "Tehran, Tehran Province, Iran",
			role: "Frontend Team Lead",
			startDate: "2022-08",
			endDate: "2024-08",
			summary:
				"Led the frontend team at a software company, progressing from engineer to team lead over two years. Owned architecture decisions, mentored junior developers, and drove adoption of modern frontend practices.",
			highlights: [
				"Promoted from Frontend Engineer to Frontend Team Lead within one year.",
				"Led frontend architecture decisions and code quality improvements.",
				"Mentored junior developers and established frontend best practices.",
			],
			technologies: [
				"React",
				"Next.js",
				"Monorepo",
				"MobX",
				"Storybook",
				"Team Leadership",
				"File Management",
			],
			tier: "primary",
		},
		{
			id: "abrbar",
			company: "AbrBar",
			location: "Tehran, Tehran Province, Iran",
			role: "Frontend Developer",
			startDate: "2021-08",
			endDate: "2023-03",
			summary:
				"Built and maintained frontend features for a remote-first product team, shipping responsive interfaces and improving component reusability.",
			highlights: [
				"Developed responsive UI components and improved code maintainability.",
				"Collaborated effectively in a fully remote work environment.",
			],
			technologies: [
				"React",
				"Next.js",
				"GraphQL",
				"React Query",
				"MUI",
				"Leaflet",
				"JWT",
				"TDD",
			],
			tier: "secondary",
		},
		{
			id: "didehban",
			company: "Didehban Sanat",
			location: "Tehran, Tehran Province, Iran",
			role: "Frontend Developer",
			startDate: "2021-02",
			endDate: "2022-01",
			summary:
				"Developed frontend interfaces for industrial software solutions, building reusable components and contributing to the company's web platform.",
			highlights: [
				"Built reusable frontend components for industrial software applications.",
				"Contributed to the development of the company's web platform.",
			],
			technologies: ["React", "Next.js", "JavaScript", "CSS-in-JS", "REST APIs"],
			tier: "secondary",
		},
	]);
