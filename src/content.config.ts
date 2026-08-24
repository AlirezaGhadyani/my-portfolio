import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z as zod } from 'astro/zod';

const caseStudies = defineCollection({
  loader: glob({
    pattern: 'src/content/case-studies/**/*.{md,mdx}',
    base: './',
    generateId: ({ entry }) => {
      const file = entry.split('/').pop() ?? entry;
      return file.replace(/\.(md|mdx)$/i, '');
    },
  }),
  schema: zod.object({
    title: zod.string(),
    projectSlug: zod.string(),
    role: zod.string(),
    duration: zod.string(),
    summary: zod.string(),
    techStack: zod.array(zod.string()),
    impactMetrics: zod.array(zod.string()),
  }),
});

export const collections = { caseStudies };