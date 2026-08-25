import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z as zod } from "zod";

const caseStudies = defineCollection({
	loader: glob({
		pattern: "src/content/case-studies/**/*.md",
		base: "./",
		generateId: ({ entry }) => {
			const file = entry.split("/").pop() ?? entry;
			return file.replace(/\.(md|mdx)$/i, "");
		},
	}),
	schema: zod.object({
		title: zod.string(),
		projectSlug: zod.string(),
		duration: zod.string(),
		summary: zod.string(),
	}),
});

export const collections = { caseStudies };
