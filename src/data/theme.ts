import { z } from "zod";

export const PaletteTokenGroupSchema = z.object({
	accent: z.string(),
	accentHover: z.string(),
	accentMuted: z.string(),
	accentGlow: z.string(),
	borderActive: z.string(),
});

export const PaletteDefinitionSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	light: PaletteTokenGroupSchema,
	dark: PaletteTokenGroupSchema,
});

export const ThemeConfigSchema = z
	.object({
		defaultPalette: z.string(),
		palettes: z.record(z.string(), PaletteDefinitionSchema),
	})
	.superRefine((value, context) => {
		if (!(value.defaultPalette in value.palettes)) {
			context.addIssue({
				code: "custom",
				path: ["defaultPalette"],
				message: "defaultPalette must reference a configured palette",
			});
		}
	});

const config = {
	defaultPalette: "amber",
	palettes: {
		amber: {
			id: "amber",
			name: "Warm Ochre",
			description: "Terracotta / Ember",
			light: {
				accent: "hsl(13 68% 46%)",
				accentHover: "hsl(13 68% 38%)",
				accentMuted: "hsl(13 65% 93%)",
				accentGlow: "hsl(13 68% 46% / 0.15)",
				borderActive: "hsl(13 68% 46%)",
			},
			dark: {
				accent: "hsl(33 85% 62%)",
				accentHover: "hsl(33 90% 72%)",
				accentMuted: "hsl(33 85% 62% / 0.14)",
				accentGlow: "hsl(33 85% 62% / 0.22)",
				borderActive: "hsl(33 85% 62%)",
			},
		},
		ocean: {
			id: "ocean",
			name: "Nordic Slate",
			description: "Ocean / Cobalt",
			light: {
				accent: "hsl(217 91% 45%)",
				accentHover: "hsl(217 91% 37%)",
				accentMuted: "hsl(217 90% 94%)",
				accentGlow: "hsl(217 91% 45% / 0.15)",
				borderActive: "hsl(217 91% 45%)",
			},
			dark: {
				accent: "hsl(212 95% 64%)",
				accentHover: "hsl(212 95% 74%)",
				accentMuted: "hsl(212 95% 64% / 0.14)",
				accentGlow: "hsl(212 95% 64% / 0.22)",
				borderActive: "hsl(212 95% 64%)",
			},
		},
		emerald: {
			id: "emerald",
			name: "Forest & Mint",
			description: "Emerald / Jade",
			light: {
				accent: "hsl(160 84% 24%)",
				accentHover: "hsl(160 84% 18%)",
				accentMuted: "hsl(160 70% 93%)",
				accentGlow: "hsl(160 84% 24% / 0.15)",
				borderActive: "hsl(160 84% 24%)",
			},
			dark: {
				accent: "hsl(158 75% 52%)",
				accentHover: "hsl(158 80% 64%)",
				accentMuted: "hsl(158 75% 52% / 0.14)",
				accentGlow: "hsl(158 75% 52% / 0.22)",
				borderActive: "hsl(158 75% 52%)",
			},
		},
		amethyst: {
			id: "amethyst",
			name: "Neon Iris",
			description: "Amethyst / Berry",
			light: {
				accent: "hsl(270 70% 48%)",
				accentHover: "hsl(270 70% 40%)",
				accentMuted: "hsl(270 65% 94%)",
				accentGlow: "hsl(270 70% 48% / 0.15)",
				borderActive: "hsl(270 70% 48%)",
			},
			dark: {
				accent: "hsl(270 85% 68%)",
				accentHover: "hsl(270 85% 78%)",
				accentMuted: "hsl(270 85% 68% / 0.14)",
				accentGlow: "hsl(270 85% 68% / 0.22)",
				borderActive: "hsl(270 85% 68%)",
			},
		},
		rose: {
			id: "rose",
			name: "Subtle Ruby",
			description: "Rose / Crimson",
			light: {
				accent: "hsl(346 77% 46%)",
				accentHover: "hsl(346 77% 38%)",
				accentMuted: "hsl(346 70% 94%)",
				accentGlow: "hsl(346 77% 46% / 0.15)",
				borderActive: "hsl(346 77% 46%)",
			},
			dark: {
				accent: "hsl(346 88% 65%)",
				accentHover: "hsl(346 90% 75%)",
				accentMuted: "hsl(346 88% 65% / 0.14)",
				accentGlow: "hsl(346 88% 65% / 0.22)",
				borderActive: "hsl(346 88% 65%)",
			},
		},
	},
} as const;

export const themeConfig = ThemeConfigSchema.parse(config);
export const paletteIds = Object.keys(themeConfig.palettes);
export type PaletteId = keyof typeof themeConfig.palettes;
