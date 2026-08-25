import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { ThemeConfigSchema, paletteIds, themeConfig } from "./theme.ts";

describe("themeConfig", () => {
	it("parses the configured palette catalog", () => {
		expect(ThemeConfigSchema.safeParse(themeConfig).success).toBe(true);
	});

	it("uses a palette that exists in the catalog as the default", () => {
		expect(themeConfig.palettes[themeConfig.defaultPalette]).toBeDefined();
		expect(paletteIds).toHaveLength(5);
	});

	it("rejects a default palette that is not configured", () => {
		const result = ThemeConfigSchema.safeParse({ ...themeConfig, defaultPalette: "missing" });
		expect(result.success).toBe(false);
	});

	it("provides complete light and dark token groups", () => {
		for (const palette of Object.values(themeConfig.palettes)) {
			expect(Object.values(palette.light)).toHaveLength(5);
			expect(Object.values(palette.dark)).toHaveLength(5);
		}
	});
});

describe("palette parity: global.css matches theme.ts", () => {
	const cssPath = path.resolve(process.cwd(), "src/styles/global.css");
	const cssContent = fs.readFileSync(cssPath, "utf-8");

	const tokenMap: Record<string, string> = {
		accent: "accent",
		accentHover: "accent-hover",
		accentMuted: "accent-muted",
		accentGlow: "accent-glow",
		borderActive: "border-active",
	};

	function cssTokenFor(palette: string, theme: "light" | "dark", token: string): string {
		const selector = `html[data-palette="${palette}"][data-theme="${theme}"]`;
		const start = cssContent.indexOf(selector);
		if (start === -1) {
			throw new Error(`Palette rule missing in global.css: ${selector}`);
		}
		const blockStart = cssContent.indexOf("{", start);
		const blockEnd = cssContent.indexOf("}", blockStart);
		const block = cssContent.slice(blockStart + 1, blockEnd);
		const match = block.match(new RegExp(`--${token}:\\s*([^;]+);`));
		if (!match) {
			throw new Error(`Token --${token} missing from ${selector}`);
		}
		return match[1].trim();
	}

	for (const palette of paletteIds) {
		for (const theme of ["light", "dark"] as const) {
			it(`keeps ${palette} ${theme} tokens identical between theme.ts and global.css`, () => {
				const config = themeConfig.palettes[palette][theme];
				for (const [tsKey, cssKey] of Object.entries(tokenMap) as [keyof typeof config, string][]) {
					expect(cssTokenFor(palette, theme, cssKey)).toBe(config[tsKey]);
				}
			});
		}
	}

	it("expresses every palette, including the amber default, as an explicit palette rule", () => {
		for (const palette of paletteIds) {
			expect(cssContent).toContain(`html[data-palette="${palette}"][data-theme="light"]`);
			expect(cssContent).toContain(`html[data-palette="${palette}"][data-theme="dark"]`);
		}
	});
});
