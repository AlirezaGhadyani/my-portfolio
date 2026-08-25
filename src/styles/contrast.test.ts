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

	function extractToken(palette: string, theme: "light" | "dark", tokenName: string): string {
		const selector =
			palette === "amber"
				? theme === "light"
					? ':root,\nhtml[data-theme="light"]'
					: 'html[data-theme="dark"]'
				: `html[data-palette="${palette}"][data-theme="${theme}"]`;

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

	for (const palette of palettes) {
		for (const theme of modes) {
			it(`asserts contrast(--on-accent, --accent) >= 4.5 for ${palette} in ${theme} mode`, () => {
				const accent = extractToken(palette, theme, "accent");
				const onAccent = extractToken(palette, theme, "on-accent");
				const ratio = getContrastRatio(onAccent, accent);

				expect(ratio).toBeGreaterThanOrEqual(4.5);
			});
		}
	}
});
