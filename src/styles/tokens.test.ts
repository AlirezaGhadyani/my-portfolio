import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { globSync } from "node:fs";

const srcRoot = path.resolve(process.cwd(), "src");

function allAstroFiles(): string[] {
	return globSync(path.join(srcRoot, "**", "*.astro"));
}

function styleBlocks(source: string): string {
	const blocks = source.match(/<style[^>]*>[\s\S]*?<\/style>/g);
	return blocks ? blocks.join("\n") : "";
}

describe("design-token purity outside the print page", () => {
	const nonPrintFiles = allAstroFiles().filter((f) => !f.replace(/\\/g, "/").includes("/print/"));

	it("bans raw hsl() literals in non-print .astro files", () => {
		const offenders = nonPrintFiles.filter((f) => /hsl\(\s*[\d.]+/.test(styleBlocks(fs.readFileSync(f, "utf-8"))));
		expect(offenders).toEqual([]);
	});

	it("bans raw hex color literals in non-print .astro files", () => {
		const offenders = nonPrintFiles.filter((f) =>
			/#[0-9a-fA-F]{6}(?![\w-])|#[0-9a-fA-F]{3}(?![\w-])/.test(styleBlocks(fs.readFileSync(f, "utf-8"))),
		);
		expect(offenders).toEqual([]);
	});

	it("bans numeric border-radius literals in non-print .astro files", () => {
		const offenders = nonPrintFiles.filter((f) => /border-radius:\s*(?!var\()\S+/.test(fs.readFileSync(f, "utf-8")));
		expect(offenders).toEqual([]);
	});

	it("bans references to deleted tokens (--radius, --transition-smooth, --shadow-color)", () => {
		const files = allAstroFiles().concat([path.join(srcRoot, "styles/global.css")]);
		const offenders = files.filter((f) =>
			/var\(--radius\)|var\(--transition-smooth\)|var\(--shadow-color\)/.test(fs.readFileSync(f, "utf-8")),
		);
		expect(offenders).toEqual([]);
	});

	it("does not declare the retired --radius token in global.css", () => {
		const css = fs.readFileSync(path.join(srcRoot, "styles/global.css"), "utf-8");
		expect(/--radius:(?!-)/.test(css)).toBe(false);
	});
});
