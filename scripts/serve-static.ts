import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createStaticHandler } from "./lib/static-server.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "../dist");

function startStaticServer(portArg: string): void {
	const port = Number(portArg) || 4321;
	const server = http.createServer(createStaticHandler(distDir));

	server.listen(port, "127.0.0.1", () => {
		console.log(`[serve-static] Serving ${distDir} on http://127.0.0.1:${port}`);
	});
}

startStaticServer(process.argv[2]);
