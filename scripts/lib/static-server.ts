import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const MIME_TYPES: Record<string, string> = {
	".html": "text/html; charset=utf-8",
	".css": "text/css",
	".js": "application/javascript",
	".json": "application/json",
	".svg": "image/svg+xml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".ico": "image/x-icon",
	".pdf": "application/pdf",
	".txt": "text/plain",
	".woff2": "font/woff2",
	".woff": "font/woff",
	".ttf": "font/ttf",
};

/**
 * Build a static file request handler rooted at `baseDir`. Path resolution is
 * bounded to the base directory (403 on traversal attempts) and matches
 * extension-less routes to `index.html` / `path.html`.
 */
export function createStaticHandler(baseDir: string): http.RequestListener {
	const resolvedBaseDir = path.resolve(baseDir);

	return (req, res) => {
		let reqPath = (req.url || "/").split("?")[0];
		if (reqPath.endsWith("/")) reqPath += "index.html";

		const normalizedReqPath = path.normalize(reqPath).replace(/^(\.\.[/\\])+/, "");
		let filePath = path.resolve(resolvedBaseDir, `.${normalizedReqPath}`);

		if (!filePath.startsWith(resolvedBaseDir)) {
			res.writeHead(403, { "Content-Type": "text/plain" });
			res.end("Forbidden");
			return;
		}

		if (!fs.existsSync(filePath) && fs.existsSync(`${filePath}.html`)) {
			filePath = `${filePath}.html`;
		} else if (fs.existsSync(path.join(filePath, "index.html"))) {
			filePath = path.join(filePath, "index.html");
		}

		if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
			res.writeHead(404, { "Content-Type": "text/plain" });
			res.end("Not Found");
			return;
		}

		const ext = path.extname(filePath);
		res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
		fs.createReadStream(filePath).pipe(res);
	};
}
