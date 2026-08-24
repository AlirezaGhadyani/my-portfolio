import { ResumeDataSchema } from './schema.ts';
import type { ResumeData } from './schema.ts';
import { skills } from './skills.ts';
import { experience } from './experience.ts';
import { projects } from './projects.ts';

export const resumeData: ResumeData = ResumeDataSchema.parse({
  identity: {
    name: 'Jordan Avery',
    title: 'Full-Stack Software Engineer',
    tagline: 'I design and ship fast, accessible web platforms with clean architecture.',
    email: 'jordan.avery@example.com',
    phone: '+44 7700 900123',
    location: 'Cambridge, UK',
    website: 'https://example.com',
    links: [
      { label: 'GitHub', url: 'https://github.com/', icon: 'github' },
      { label: 'LinkedIn', url: 'https://linkedin.com/', icon: 'linkedin' },
    ],
  },
  summary: {
    short:
      'Full-stack engineer specialising in TypeScript, React, Astro and edge hosting. History of cutting latency, improving Core Web Vitals, and leading design-system adoption.',
    full:
      'Full-stack engineer with a record of shipping high-traffic platforms, leading asynchronous teams, and lifting Core Web Vitals to a perfect score. Comfortable owning architecture from Postgres to edge-rendered static output, and equally at home refining a design system, building CI, or teaching the craft. I care about semantics over ceremony: accessible, fast, honest engineering.',
  },
  skills,
  experience,
  projects,
  education: [
    {
      institution: 'University of Cambridge',
      degree: 'MEng',
      field: 'Computer Science',
      startDate: '2015-09',
      endDate: '2019-06',
      honors: 'First-class honours',
    },
  ],
  certifications: [
    {
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      date: '2023-04',
      url: 'https://aws.amazon.com/certification/',
    },
  ],
});