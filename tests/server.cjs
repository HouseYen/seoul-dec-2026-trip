const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json; charset=utf-8' };
const evidenceFiles = fs.readdirSync(path.join(root, 'docs/price-evidence')).filter(name => name.endsWith('.txt')).map(name => 'docs/price-evidence/' + name);
const currentEvidenceFiles = fs.readdirSync(path.join(root, 'docs/current-hotel-evidence')).filter(name => name.endsWith('.txt')).map(name => 'docs/current-hotel-evidence/' + name);
const publicFiles = new Set(['index.html', 'app.js', 'trip-data.js', 'price-data.js', 'hotel-options.js', 'styles.css', 'social-card.svg', 'social-card.png', 'docs/price-audit.json', 'docs/current-hotels.json', ...evidenceFiles, ...currentEvidenceFiles]);
http.createServer((request, response) => {
  const pathname = new URL(request.url, 'http://127.0.0.1').pathname;
  const filename = pathname === '/' ? 'index.html' : pathname.slice(1);
  if (!publicFiles.has(filename)) { response.writeHead(404); response.end('Not found'); return; }
  fs.readFile(path.join(root, filename), (error, data) => {
    if (error) { response.writeHead(404); response.end('Not found'); return; }
    response.writeHead(200, { 'Content-Type': types[path.extname(filename)], 'Cache-Control': 'no-store' });
    response.end(data);
  });
}).listen(Number(process.env.PORT || 4183), '127.0.0.1', () => console.log('Local trip preview ready'));
