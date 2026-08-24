import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resumeData } from '../src/data/resume.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const distDir = path.join(projectRoot, 'dist');
const caseStudiesDir = path.join(projectRoot, 'src', 'content', 'case-studies');

const siteUrl = resumeData.identity.website.replace(/\/+$/, '');
const absolute = (pathname: string) => `${siteUrl}${pathname}`;

function collectPaths(): string[] {
	const paths = new Set<string>(['/', '/projects']);

	if (fs.existsSync(caseStudiesDir)) {
		const entries = fs.readdirSync(caseStudiesDir);
		for (const entry of entries) {
			if (/\.(md|mdx)$/i.test(entry)) {
				const slug = entry.replace(/\.(md|mdx)$/i, '');
				paths.add(`/projects/${slug}`);
			}
		}
	}

	for (const project of resumeData.projects) {
		if (project.hasCaseStudy) paths.add(`/projects/${project.slug}`);
	}

	return [...paths].sort();
}

function buildSitemap(paths: string[]): string {
	const urls = paths
		.map(
			(pathname) =>
				`  <url>\n    <loc>${absolute(pathname)}</loc>\n    <changefreq>monthly</changefreq>\n  </url>`,
		)
		.join('\n');
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function buildRobots(): string {
	return [
		'User-agent: *',
		'Allow: /',
		'Disallow: /print',
		'Disallow: /downloads',
		'Disallow: /api',
		'',
		`Sitemap: ${absolute('/sitemap.xml')}`,
		'',
	].join('\n');
}

function mirrorToDist(relativePath: string): void {
	if (!fs.existsSync(distDir)) return;
	const sourcePath = path.join(publicDir, relativePath);
	const targetPath = path.join(distDir, relativePath);
	fs.copyFileSync(sourcePath, targetPath);
}

export function writeSitemap(): void {
	const paths = collectPaths();
	const sitemap = buildSitemap(paths);
	const robots = buildRobots();

	const sitemapPath = path.join(publicDir, 'sitemap.xml');
	const robotsPath = path.join(publicDir, 'robots.txt');
	fs.writeFileSync(sitemapPath, sitemap, 'utf-8');
	fs.writeFileSync(robotsPath, robots, 'utf-8');

	console.log(`[sitemap] Generated ${paths.length} URLs -> ${sitemapPath}`);
	console.log(`[sitemap] Generated -> ${robotsPath}`);

	mirrorToDist('sitemap.xml');
	mirrorToDist('robots.txt');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	writeSitemap();
}