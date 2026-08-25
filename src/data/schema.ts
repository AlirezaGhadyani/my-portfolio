import { z } from "zod";

export const LinkSchema = z.object({
	label: z.string(),
	url: z.url(),
	icon: z.string().optional(),
	printHidden: z.boolean().default(false),
});

export const ExperienceItemSchema = z.object({
	id: z.string(),
	company: z.string(),
	location: z.string(),
	role: z.string(),
	startDate: z.string(),
	endDate: z.string().optional(),
	summary: z.string(),
	highlights: z.array(z.string()),
	technologies: z.array(z.string()),
	featured: z.boolean().default(true),
	tier: z.enum(["primary", "secondary"]).default("primary"),
});

export const ProjectSchema = z.object({
	slug: z.string(),
	title: z.string(),
	subtitle: z.string(),
	description: z.string(),
	role: z.string(),
	impactMetrics: z.array(z.string()).optional(),
	technologies: z.array(z.string()),
	githubUrl: z.url().optional(),
	liveUrl: z.url().optional(),
	featured: z.boolean().default(false),
	tier: z.enum(["flagship", "notable", "experiment"]).default("notable"),
	hasCaseStudy: z.boolean().default(false),
});

export const SkillSchema = z.object({
	name: z.string(),
	level: z.enum(["expert", "proficient", "familiar"]).optional(),
	highlighted: z.boolean().default(false),
});

export const SkillCategorySchema = z.object({
	name: z.string(),
	skills: z.array(SkillSchema),
});

export const EducationItemSchema = z.object({
	institution: z.string(),
	degree: z.string(),
	field: z.string(),
	startDate: z.string(),
	endDate: z.string(),
	honors: z.string().optional(),
});

export const CertificationSchema = z.object({
	name: z.string(),
	issuer: z.string(),
	date: z.string(),
	url: z.url().optional(),
});

export const ResumeDataSchema = z.object({
	identity: z.object({
		name: z.string(),
		title: z.string(),
		tagline: z.string(),
		email: z.email(),
		phone: z.string().optional(),
		location: z.string(),
		website: z.url(),
		links: z.array(LinkSchema),
	}),
	summary: z.object({
		short: z.string(),
		full: z.string(),
	}),
	skills: z.array(SkillCategorySchema),
	experience: z.array(ExperienceItemSchema),
	projects: z.array(ProjectSchema),
	education: z.array(EducationItemSchema),
	certifications: z.array(CertificationSchema).optional(),
});

export type Link = z.infer<typeof LinkSchema>;
export type ExperienceItem = z.infer<typeof ExperienceItemSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type SkillCategory = z.infer<typeof SkillCategorySchema>;
export type EducationItem = z.infer<typeof EducationItemSchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type ResumeData = z.infer<typeof ResumeDataSchema>;
