import { ProjectSchema } from "./schema.ts";
import type { Project } from "./schema.ts";

export const projects: Project[] = ProjectSchema.array()
	.min(1)
	.parse([
		{
			slug: "async-threat-platform",
			title: "Async Threat Intelligence Platform",
			subtitle: "Edge-rendered SaaS with serverless ingestion",
			description:
				"A security analytics platform that ingests millions of signals per hour and renders near-zero-JS dashboards at the edge.",
			role: "Lead full-stack engineer",
			impactMetrics: ["-40% p95 latency", "2.4M signals/day"],
			technologies: ["Astro", "Cloudflare", "TypeScript", "PostgreSQL", "React"],
			featured: true,
			tier: "flagship",
			hasCaseStudy: true,
		},
		{
			slug: "design-system",
			title: "Theme-Aware Design System",
			subtitle: "Four products, one component library",
			description:
				"A semantic, themeable design system powering consistent, accessible UI across four product surfaces.",
			role: "System owner",
			impactMetrics: ["4 products", "100 Lighthouse performance"],
			technologies: ["React", "Tailwind CSS", "TypeScript"],
			featured: true,
			tier: "notable",
		},
		{
			slug: "telemetry-dashboard",
			title: "Low-Latency Telemetry Dashboard",
			subtitle: "R&D prototype with sub-second streaming",
			description:
				"A streaming telemetry dashboard prototype for defence R&D, delivering sub-second data updates over WebSocket.",
			role: "Solo engineer",
			technologies: ["TypeScript", "React", "WebSocket"],
			tier: "experiment",
			hasCaseStudy: false,
		},
		{
			slug: "ci-release-automation",
			title: "CI Release Automation",
			subtitle: "Halved deployment time across teams",
			description:
				"Automated release pipelines and smoke-testing that reduced deployment time by 50% and improved shipping cadence.",
			role: "Engineering contributor",
			technologies: ["Python", "Azure DevOps", "TypeScript"],
			tier: "notable",
		},
		{
			slug: "personal-site",
			title: "This Portfolio & Resume System",
			subtitle: "Zero-JS static, PDF-at-build",
			description:
				"The site you are looking at — a fully static Astro portfolio with build-time Playwright PDF and ATS export.",
			role: "Solo engineer",
			impactMetrics: ["0KB runtime JS", "100 Core Web Vitals"],
			technologies: ["Astro", "Tailwind CSS", "Playwright", "Cloudflare Pages"],
			featured: true,
			tier: "notable",
			liveUrl: "https://example.com",
		},
	]);
