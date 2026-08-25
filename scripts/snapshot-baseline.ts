import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");
const downloadsDir = path.join(projectRoot, "public", "downloads");
const baselineDir = path.join(projectRoot, ".baseline");

function getPageCount(pdfBuffer: Buffer): number {
	const matches = pdfBuffer.toString("binary").match(/\/Type\s*\/Page[^s]/g);
	return matches ? matches.length : 0;
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
	s /= 100;
	l /= 100;
	const k = (n: number) => (n + h / 30) % 12;
	const a = s * Math.min(l, 1 - l);
	const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
	return [f(0), f(8), f(4)];
}

function parseHsl(hslStr: string): [number, number, number] {
	const match = hslStr.match(/hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/);
	if (!match) throw new Error(`Cannot parse HSL: ${hslStr}`);
	return [parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3])];
}

function relativeLuminance(rgb: [number, number, number]): number {
	const srgb = rgb.map((val) => {
		return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
	});
	return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function contrastRatio(l1: number, l2: number): number {
	const lighter = Math.max(l1, l2);
	const darker = Math.min(l1, l2);
	return (lighter + 0.05) / (darker + 0.05);
}

export function recordBaseline(): void {
	if (!fs.existsSync(distDir)) {
		throw new Error(`Build directory not found at ${distDir}. Run 'pnpm build:all' first.`);
	}

	if (!fs.existsSync(baselineDir)) {
		fs.mkdirSync(baselineDir, { recursive: true });
	}

	// 1. Built route paths
	const routes: string[] = [];
	function walk(dir: string, prefix = "") {
		for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
			if (entry.isDirectory()) {
				if (entry.name !== "downloads" && entry.name !== "_astro") {
					walk(path.join(dir, entry.name), `${prefix}/${entry.name}`);
				}
			} else if (entry.name === "index.html") {
				routes.push(prefix ? `${prefix}/` : "/");
			}
		}
	}
	walk(distDir);
	routes.sort();

	// 2. PDF metrics
	const pdfs: Record<string, { pages: number; bytes: number }> = {};
	const pdfDir = fs.existsSync(downloadsDir) ? downloadsDir : path.join(distDir, "downloads");
	if (fs.existsSync(pdfDir)) {
		for (const file of fs.readdirSync(pdfDir)) {
			if (file.endsWith(".pdf")) {
				const filePath = path.join(pdfDir, file);
				const buffer = fs.readFileSync(filePath);
				pdfs[file] = {
					pages: getPageCount(buffer),
					bytes: buffer.length,
				};
			}
		}
	}

	// 3. resume-ats.txt content
	const atsPath = path.join(pdfDir, "resume-ats.txt");
	let atsContent = "";
	if (fs.existsSync(atsPath)) {
		atsContent = fs.readFileSync(atsPath, "utf8");
	}

	// 4. Contrast ratios
	const whiteLum = relativeLuminance([1, 1, 1]);
	const darkAmberAccentLum = relativeLuminance(hslToRgb(...parseHsl("hsl(33 85% 62%)")));
	const darkEmeraldAccentLum = relativeLuminance(hslToRgb(...parseHsl("hsl(158 64% 52%)")));
	const darkOceanAccentLum = relativeLuminance(hslToRgb(...parseHsl("hsl(212 95% 64%)")));
	const darkRoseAccentLum = relativeLuminance(hslToRgb(...parseHsl("hsl(346 77% 62%)")));
	const darkAmethystAccentLum = relativeLuminance(hslToRgb(...parseHsl("hsl(268 75% 67%)")));

	const contrast = {
		whiteOnDarkAmberAccent: Number(contrastRatio(whiteLum, darkAmberAccentLum).toFixed(2)),
		whiteOnDarkEmeraldAccent: Number(contrastRatio(whiteLum, darkEmeraldAccentLum).toFixed(2)),
		whiteOnDarkOceanAccent: Number(contrastRatio(whiteLum, darkOceanAccentLum).toFixed(2)),
		whiteOnDarkRoseAccent: Number(contrastRatio(whiteLum, darkRoseAccentLum).toFixed(2)),
		whiteOnDarkAmethystAccent: Number(contrastRatio(whiteLum, darkAmethystAccentLum).toFixed(2)),
	};

	const snapshot = {
		timestamp: new Date().toISOString(),
		routes,
		pdfs,
		atsHeadline: atsContent.split("\n").slice(0, 5),
		contrast,
	};

	const snapshotFile = path.join(baselineDir, "snapshot.json");
	fs.writeFileSync(snapshotFile, JSON.stringify(snapshot, null, 2), "utf8");
	console.log(`[baseline] Snapshot recorded to ${snapshotFile}:`);
	console.log(JSON.stringify(snapshot, null, 2));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	recordBaseline();
}
