import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';
import { chromium, type Browser, type LaunchOptions } from 'playwright';
import { VARIANTS, type ResumeVariant } from '../src/data/variants.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const downloadsDir = path.join(projectRoot, 'public', 'downloads');
const distDir = path.join(projectRoot, 'dist');

const MIME_TYPES: Record<string, string> = {
	'.html': 'text/html',
	'.css': 'text/css',
	'.js': 'application/javascript',
	'.json': 'application/json',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.ico': 'image/x-icon',
	'.woff2': 'font/woff2',
	'.woff': 'font/woff',
	'.ttf': 'font/ttf',
};

function startStaticServer(baseDir: string): Promise<{ server: http.Server; port: number }> {
	const resolvedBaseDir = path.resolve(baseDir);
	return new Promise((resolve, reject) => {
		const server = http.createServer((req, res) => {
			let reqPath = (req.url || '/').split('?')[0];
			if (reqPath.endsWith('/')) {
				reqPath += 'index.html';
			}

			const normalizedReqPath = path.normalize(reqPath).replace(/^(\.\.[/\\])+/, '');
			let filePath = path.resolve(resolvedBaseDir, `.${normalizedReqPath}`);

			if (!filePath.startsWith(resolvedBaseDir)) {
				res.writeHead(403, { 'Content-Type': 'text/plain' });
				res.end('Forbidden');
				return;
			}

			if (!fs.existsSync(filePath) && fs.existsSync(`${filePath}.html`)) {
				filePath = `${filePath}.html`;
			} else if (fs.existsSync(path.join(filePath, 'index.html'))) {
				filePath = path.join(filePath, 'index.html');
			}

			if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
				res.writeHead(404, { 'Content-Type': 'text/plain' });
				res.end('Not Found');
				return;
			}

			const ext = path.extname(filePath);
			const contentType = MIME_TYPES[ext] || 'application/octet-stream';
			res.writeHead(200, { 'Content-Type': contentType });
			fs.createReadStream(filePath).pipe(res);
		});

		server.listen(0, '127.0.0.1', () => {
			const addr = server.address();
			if (typeof addr === 'object' && addr !== null) {
				resolve({ server, port: addr.port });
			} else {
				reject(new Error('Failed to get server address'));
			}
		});

		server.on('error', reject);
	});
}

async function launchBrowser(): Promise<Browser> {
	const systemChrome = ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find(p => fs.existsSync(p));

	const options: LaunchOptions = {
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
	};

	if (systemChrome) {
		options.executablePath = systemChrome;
	}

	return chromium.launch(options);
}

export async function generatePdfs(): Promise<void> {
	if (!fs.existsSync(distDir)) {
		throw new Error(`Build output directory not found at ${distDir}. Please run 'astro build' first.`);
	}

	if (!fs.existsSync(downloadsDir)) {
		fs.mkdirSync(downloadsDir, { recursive: true });
	}

	const distDownloadsDir = path.join(distDir, 'downloads');
	if (!fs.existsSync(distDownloadsDir)) {
		fs.mkdirSync(distDownloadsDir, { recursive: true });
	}

	console.log('[pdf] Starting static server for dist/...');
	const { server, port } = await startStaticServer(distDir);
	console.log(`[pdf] Server running on http://127.0.0.1:${port}`);

	let browser: Browser | null = null;
	try {
		browser = await launchBrowser();
		const page = await browser.newPage({
			viewport: { width: 1280, height: 960 },
			deviceScaleFactor: 2,
		});

		const variantsToGenerate = Object.keys(VARIANTS) as ResumeVariant[];

		for (const vKey of variantsToGenerate) {
			const routePath = vKey === 'fullstack' ? '/print/resume/' : `/print/resume/${vKey}/`;
			const targetUrl = `http://127.0.0.1:${port}${routePath}`;
			const outPdfPath = path.join(downloadsDir, `resume-${vKey}.pdf`);

			console.log(`[pdf] Generating: ${vKey} -> ${outPdfPath}`);
			await page.goto(targetUrl, { waitUntil: 'networkidle' });
			await page.emulateMedia({ media: 'print' });

			await page.pdf({
				path: outPdfPath,
				format: 'A4',
				printBackground: true,
				preferCSSPageSize: true,
				margin: {
					top: '0mm',
					bottom: '0mm',
					left: '0mm',
					right: '0mm',
				},
			});

			// Mirror to dist/downloads for production static builds
			const distPdfPath = path.join(distDownloadsDir, `resume-${vKey}.pdf`);
			fs.copyFileSync(outPdfPath, distPdfPath);

			console.log(`[pdf] Successfully generated: ${outPdfPath}`);
		}
	} finally {
		if (browser) {
			await browser.close();
		}
		server.close();
	}
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	generatePdfs().catch((err) => {
		console.error('[pdf] Error generating PDFs:', err);
		process.exit(1);
	});
}
