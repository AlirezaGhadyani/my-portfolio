import { describe, expect, it } from "vitest";
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
