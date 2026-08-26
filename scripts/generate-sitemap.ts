import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resumeData } from "../src/data/resume.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");

const siteUrl = resumeData.identity.website.replace(/\/+$/, "");
const absolute = (pathname: string) => `${siteUrl}${pathname}`;

function collectPaths(): string[] {
	const paths = new Set<string>(["/", "/projects"]);

	for (const project of resumeData.projects) {
		if (project.hasCaseStudy) paths.add(`/projects/${project.slug}`);
	}

	return [...paths].sort();
}

const dateOnly = (value: Date) => value.toISOString().slice(0, 10);

function lastmodFor(pathname: string): string {
	if (pathname.startsWith("/projects/")) {
		const slug = pathname.split("/")[2];
		const mdPath = path.join(projectRoot, "src", "content", "case-studies", `${slug}.md`);
		if (fs.existsSync(mdPath)) return dateOnly(fs.statSync(mdPath).mtime);
	}
	const resumePath = path.join(projectRoot, "src", "data", "resume.ts");
	return dateOnly(fs.statSync(resumePath).mtime);
}

function buildSitemap(paths: string[]): string {
	const urls = paths
		.map(
			(pathname) =>
				`  <url>\n    <loc>${absolute(pathname)}</loc>\n    <lastmod>${lastmodFor(pathname)}</lastmod>\n    <changefreq>monthly</changefreq>\n  </url>`,
		)
		.join("\n");
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function buildRobots(): string {
	return [
		"User-agent: *",
		"Allow: /",
		"Disallow: /print",
		"Disallow: /api",
		"",
		`Sitemap: ${absolute("/sitemap.xml")}`,
		"",
	].join("\n");
}

export function writeSitemap(): void {
	const paths = collectPaths();
	const sitemap = buildSitemap(paths);
	const robots = buildRobots();

	const sitemapPath = path.join(distDir, "sitemap.xml");
	const robotsPath = path.join(distDir, "robots.txt");
	fs.mkdirSync(distDir, { recursive: true });
	fs.writeFileSync(sitemapPath, sitemap, "utf-8");
	fs.writeFileSync(robotsPath, robots, "utf-8");

	console.log(`[sitemap] Generated ${paths.length} URLs -> ${sitemapPath}`);
	console.log(`[sitemap] Generated -> ${robotsPath}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	writeSitemap();
}
