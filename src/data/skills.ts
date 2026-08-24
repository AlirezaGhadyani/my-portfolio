import { SkillCategorySchema } from './schema.ts';
import type { SkillCategory } from './schema.ts';

export const skills: SkillCategory[] = SkillCategorySchema.array().min(1).parse([
  {
    name: 'Languages',
    skills: [
      { name: 'TypeScript', level: 'expert', highlighted: true },
      { name: 'JavaScript', level: 'expert' },
      { name: 'Python', level: 'proficient' },
      { name: 'HTML/CSS', level: 'expert' },
    ],
  },
  {
    name: 'Frontend & UI',
    skills: [
      { name: 'React', level: 'expert', highlighted: true },
      { name: 'Astro', level: 'expert', highlighted: true },
      { name: 'Tailwind CSS', level: 'expert', highlighted: true },
      { name: 'Next.js', level: 'proficient' },
      { name: 'Web Performance', level: 'proficient' },
    ],
  },
  {
    name: 'Backend & Cloud',
    skills: [
      { name: 'Node.js', level: 'expert', highlighted: true },
      { name: 'PostgreSQL', level: 'proficient' },
      { name: 'Cloudflare', level: 'proficient' },
      { name: 'System Architecture', level: 'proficient' },
    ],
  },
]);