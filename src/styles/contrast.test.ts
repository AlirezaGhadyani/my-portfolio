import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

function parseHsl(hslStr: string): [number, number, number] {
	const match = hslStr.match(/hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/);
	if (!match) {
		throw new Error(`Failed to parse HSL: ${hslStr}`);
	}
	return [parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3])];
}

function parseColorToRgb(colorStr: string): [number, number, number] {
	const trimmed = colorStr.trim();
	if (trimmed.startsWith("#")) {
		let hex = trimmed.slice(1);
		if (hex.length === 3) {
			hex = hex
				.split("")
				.map((c) => c + c)
				.join("");
		}
		const num = parseInt(hex, 16);
		return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
	}
	if (trimmed.startsWith("hsl")) {
		const [h, sPct, lPct] = parseHsl(trimmed);
		const s = sPct / 100;
		const l = lPct / 100;
		const k = (n: number) => (n + h / 30) % 12;
		const a = s * Math.min(l, 1 - l);
		const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
		return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
	}
	throw new Error(`Unsupported color format: ${colorStr}`);
}

function getLuminance(rgb: [number, number, number]): number {
	const [r, g, b] = rgb.map((v) => {
		const c = v / 255;
		return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(color1: string, color2: string): number {
	const lum1 = getLuminance(parseColorToRgb(color1));
	const lum2 = getLuminance(parseColorToRgb(color2));
	const brightest = Math.max(lum1, lum2);
	const darkest = Math.min(lum1, lum2);
	return (brightest + 0.05) / (darkest + 0.05);
}

describe("Theme contrast validation (WCAG AA >= 4.5)", () => {
	const globalCssPath = path.resolve(process.cwd(), "src/styles/global.css");
	const cssContent = fs.readFileSync(globalCssPath, "utf-8");

	const palettes = ["amber", "ocean", "emerald", "amethyst", "rose"] as const;
	const modes = ["light", "dark"] as const;

	function extractToken(tokenName: string, selector: string): string {
		const selectorIdx = cssContent.indexOf(selector);
		if (selectorIdx === -1) {
			throw new Error(`Selector not found in global.css: ${selector}`);
		}
		const blockStart = cssContent.indexOf("{", selectorIdx);
		const blockEnd = cssContent.indexOf("}", blockStart);
		const blockContent = cssContent.slice(blockStart + 1, blockEnd);
		const match = blockContent.match(new RegExp(`--${tokenName}:\\s*([^;]+);`));
		if (!match) {
			throw new Error(`Token --${tokenName} not found in ${selector}`);
		}
		return match[1].trim();
	}

	const baseSelector = (theme: "light" | "dark") =>
		theme === "light" ? ':root,\nhtml[data-theme="light"]' : 'html[data-theme="dark"]';
	const paletteSelector = (palette: string, theme: "light" | "dark") =>
		`html[data-palette="${palette}"][data-theme="${theme}"]`;

	const themeToken = (theme: "light" | "dark", token: string) => extractToken(token, baseSelector(theme));

	for (const theme of modes) {
		it(`asserts core text tokens clear AA on --bg (${theme})`, () => {
			const bg = themeToken(theme, "bg");
			expect(getContrastRatio(themeToken(theme, "text"), bg)).toBeGreaterThanOrEqual(4.5);
			expect(getContrastRatio(themeToken(theme, "text-muted"), bg)).toBeGreaterThanOrEqual(4.5);
			expect(getContrastRatio(themeToken(theme, "text-subtle"), bg)).toBeGreaterThanOrEqual(4.5);
		});

		it(`asserts --danger clears AA on --bg and --surface (${theme})`, () => {
			const danger = themeToken(theme, "danger");
			expect(getContrastRatio(danger, themeToken(theme, "bg"))).toBeGreaterThanOrEqual(4.5);
			expect(getContrastRatio(danger, themeToken(theme, "surface"))).toBeGreaterThanOrEqual(4.5);
		});

		it(`asserts --status-success clears AA on --bg and --surface (${theme})`, () => {
			const success = themeToken(theme, "status-success");
			expect(getContrastRatio(success, themeToken(theme, "bg"))).toBeGreaterThanOrEqual(4.5);
			expect(getContrastRatio(success, themeToken(theme, "surface"))).toBeGreaterThanOrEqual(4.5);
		});

		it(`asserts syntax colours clear AA on --surface (${theme})`, () => {
			const surface = themeToken(theme, "surface");
			expect(getContrastRatio(themeToken(theme, "syntax-string"), surface)).toBeGreaterThanOrEqual(4.5);
			expect(getContrastRatio(themeToken(theme, "syntax-number"), surface)).toBeGreaterThanOrEqual(4.5);
		});
	}

	for (const palette of palettes) {
		for (const theme of modes) {
			it(`asserts contrast(--on-accent, --accent) >= 4.5 for ${palette} in ${theme} mode`, () => {
				const accent = extractToken("accent", paletteSelector(palette, theme));
				const onAccent = extractToken("on-accent", paletteSelector(palette, theme));
				expect(getContrastRatio(onAccent, accent)).toBeGreaterThanOrEqual(4.5);
			});

			it(`asserts --accent used as text clears AA on --bg for ${palette} in ${theme} mode`, () => {
				const accent = extractToken("accent", paletteSelector(palette, theme));
				expect(getContrastRatio(accent, themeToken(theme, "bg"))).toBeGreaterThanOrEqual(4.5);
			});
		}
	}
});
