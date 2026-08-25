import { ExperienceItemSchema } from "./schema.ts";
import type { ExperienceItem } from "./schema.ts";

export const experience: ExperienceItem[] = ExperienceItemSchema.array()
	.min(1)
	.parse([
		{
			id: "sophos",
			company: "Sophos",
			location: "Abingdon, UK",
			role: "Full-Stack Software Engineer",
			startDate: "2024-01",
			summary:
				"Own delivery of resilient full-stack features across an async threat-intelligence platform, shipping high-traffic APIs and internal tooling with strong performance and observability practices.",
			highlights: [
				"Cut key API response p95 latency by 40% via query and caching optimisation.",
				"Led migration of a core service onto serverless edge architecture.",
				"Mentored three engineers and introduced stricter code-review and testing norms.",
			],
			technologies: ["TypeScript", "Python", "PostgreSQL", "Astro", "Cloudflare", "React"],
			tier: "primary",
		},
		{
			id: "linaro",
			company: "Linaro",
			location: "Remote, UK",
			role: "Software Engineer (Frontend)",
			startDate: "2021-06",
			endDate: "2023-12",
			summary:
				"Owned developer-facing portal surfaces and design system, shipping accessible component libraries and improving site-wide Core Web Vitals.",
			highlights: [
				"Raised Lighthouse performance score to 100 across key product pages.",
				"Built a reusable, theme-aware UI kit adopted by four internal products.",
			],
			technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
			tier: "secondary",
		},
		{
			id: "cambridge",
			company: "Cambridge Consultants",
			location: "Cambridge, UK",
			role: "Graduate Software Engineer",
			startDate: "2019-09",
			endDate: "2021-05",
			summary: "Shipped internal engineering tools and customer-facing prototypes in a cross-disciplinary R&D setting.",
			highlights: [
				"Prototyped a low-latency telemetry dashboard for a defence customer.",
				"Contributed to CI and release automation cutting deployment time in half.",
			],
			technologies: ["TypeScript", "React", "Python"],
			tier: "secondary",
		},
	]);
