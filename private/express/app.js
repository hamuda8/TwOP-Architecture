import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = resolve(__dirname, 'public');

function safeJson(obj) {
  if (!obj) return 'null';
  return JSON.stringify(obj).replace(/<\/script>/gi, '<\\/script>');
}

function injectState(html, state) {
  if (!state) return html;
  const stateScript = `<script>window.__STATE__ = ${safeJson(state)};</script>\n`;
  if (html.includes('</head>')) {
    return html.replace('</head>', `${stateScript}</head>`);
  }
  return stateScript + html;
}

async function serveIndex(req, res, state = null) {
  const indexPath = join(PUBLIC_DIR, 'index.html');
  const markupPath = join(PUBLIC_DIR, 'markup', 'index.html');
  
  let htmlPath = null;
  if (existsSync(indexPath)) {
    htmlPath = indexPath;
  } else if (existsSync(markupPath)) {
    htmlPath = markupPath;
  }
  
  if (!htmlPath) {
    return res.status(404).send('Not Found');
  }
  
  let html = await import('fs/promises').then(fs => fs.readFile(htmlPath, 'utf-8'));
  html = injectState(html, state);
  
  res.set({
    'Content-Type': 'text/html',
    'Cache-Control': 'no-store, no-cache, must-revalidate, private'
  });
  res.send(html);
}

app.use(express.static(PUBLIC_DIR));

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Node.js Express API!' });
});

app.get('*', async (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' });
  }
  await serveIndex(req, res);
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});