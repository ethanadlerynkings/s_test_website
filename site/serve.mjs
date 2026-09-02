import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DEFAULT_PORT = 3002;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

/** Start the static server. Returns { server, port, close() }. */
export function startServer(port = DEFAULT_PORT) {
  const server = createServer(async (req, res) => {
    try {
      const url = decodeURIComponent(req.url.split('?')[0]);
      let filePath = normalize(join(ROOT, url));
      if (!filePath.startsWith(ROOT)) {
        res.writeHead(403).end('Forbidden');
        return;
      }
      const info = await stat(filePath).catch(() => null);
      if (info?.isDirectory()) filePath = join(filePath, 'index.html');
      const body = await readFile(filePath);
      res.writeHead(200, {
        'Content-Type': TYPES[extname(filePath).toLowerCase()] ?? 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      res.end(body);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
    }
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, () => {
      resolve({
        server,
        port: server.address().port,
        close: () => new Promise((r) => server.close(r)),
      });
    });
  });
}

// Run standalone: `node serve.mjs`
if (process.argv[1] && fileURLToPath(import.meta.url) === normalize(process.argv[1])) {
  const { port } = await startServer(Number(process.env.PORT ?? DEFAULT_PORT));
  console.log(`serving ${ROOT} at http://localhost:${port}`);
}
