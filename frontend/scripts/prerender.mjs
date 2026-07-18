// Prerenders each route in dist/sitemap.xml to static HTML so crawlers and
// social scrapers get real markup + per-page meta without executing JS.
// The app re-hydrates on load (see main.tsx). Requires puppeteer:
//   npm i -D puppeteer   (or set PUPPETEER_EXECUTABLE_PATH to a Chrome binary)
import { createServer, request as httpRequest } from 'node:http';
import { readFile, writeFile, mkdir, readFileSync as read, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, extname } from 'node:path';
import { promisify } from 'node:util';

const readFileP = promisify(readFile);
const writeFileP = promisify(writeFile);
const mkdirP = promisify(mkdir);

const DIST = fileURLToPath(new URL('../dist', import.meta.url));
const PORT = 4179;
// The SPA fetches /api/portfolio at runtime, so proxy it to the live backend.
const API = new URL(process.env.API_URL || 'http://localhost:8001');

let puppeteer;
try {
  puppeteer = (await import('puppeteer')).default;
} catch {
  console.error('\n[prerender] puppeteer is not installed. Run:  npm i -D puppeteer\n');
  process.exit(1);
}

// Routes from the generated sitemap.
const sitemap = read(join(DIST, 'sitemap.xml'), 'utf8');
const routes = [...sitemap.matchAll(/<loc>[^<]*?(\/[^<]*?)<\/loc>/g)]
  .map((m) => new URL(m[1], 'http://x').pathname)
  .filter((p, i, a) => a.indexOf(p) === i);

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.json': 'application/json', '.ico': 'image/x-icon',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.txt': 'text/plain',
};

// Static file server with SPA fallback to index.html.
const indexHtml = read(join(DIST, 'index.html'), 'utf8');
const server = createServer(async (req, res) => {
  // Proxy API calls to the live backend so the app can load its data.
  if (req.url.startsWith('/api/')) {
    const proxyReq = httpRequest(
      { host: API.hostname, port: API.port, path: req.url, method: req.method, headers: { ...req.headers, host: API.host } },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers);
        proxyRes.pipe(res);
      },
    );
    proxyReq.on('error', () => {
      res.writeHead(502);
      res.end();
    });
    req.pipe(proxyReq);
    return;
  }

  const path = decodeURIComponent(req.url.split('?')[0]);
  const filePath = join(DIST, path);
  const ext = extname(filePath);
  if (ext && existsSync(filePath)) {
    res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' });
    res.end(await readFileP(filePath));
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(indexHtml);
  }
});

await new Promise((r) => server.listen(PORT, r));
const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });

for (const route of routes) {
  const page = await browser.newPage();
  await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
  // The nav only renders once portfolio data has loaded — wait for real content.
  await page.waitForSelector('header.nav', { timeout: 15000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 600)); // let reveal animations settle
  const html = '<!DOCTYPE html>\n' + (await page.content());
  await page.close();

  const outDir = route === '/' ? DIST : join(DIST, route);
  await mkdirP(outDir, { recursive: true });
  await writeFileP(join(outDir, 'index.html'), html);
  console.log(`prerendered ${route}`);
}

await browser.close();
server.close();
console.log(`\n[prerender] wrote ${routes.length} static pages.`);
