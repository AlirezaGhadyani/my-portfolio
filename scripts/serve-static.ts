import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "../dist");

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
};

function startStaticServer(portArg: string): void {
	const port = Number(portArg) || 4321;
	const server = http.createServer((req, res) => {
		let reqPath = (req.url || "/").split("?")[0];
		if (reqPath.endsWith("/")) reqPath += "index.html";

		const normalized = path.normalize(reqPath).replace(/^(\.\.[/\\])+/, "");
		let filePath = path.resolve(distDir, `.${normalized}`);

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
	});

	server.listen(port, "127.0.0.1", () => {
		console.log(`[serve-static] Serving ${distDir} on http://127.0.0.1:${port}`);
	});
}

startStaticServer(process.argv[2]);
