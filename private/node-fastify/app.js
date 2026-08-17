import fastify from 'fastify';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import { existsSync } from 'fs';
import fastifyStatic from '@fastify/static';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = fastify({ logger: true });
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

await app.register(fastifyStatic, { root: PUBLIC_DIR });

app.get('/api/hello', async (request, reply) => {
  return { message: 'Hello from Fastify API!' };
});

app.get('/*', async (request, reply) => {
  if (request.url.startsWith('/api')) {
    return reply.status(404).send({ error: 'Not found' });
  }
  
  const indexPath = join(PUBLIC_DIR, 'index.html');
  const markupPath = join(PUBLIC_DIR, 'markup', 'index.html');
  
  let htmlPath = null;
  if (existsSync(indexPath)) {
    htmlPath = indexPath;
  } else if (existsSync(markupPath)) {
    htmlPath = markupPath;
  }
  
  if (!htmlPath) {
    return reply.status(404).send('Not Found');
  }
  
  const fs = await import('fs/promises');
  let html = await fs.readFile(htmlPath, 'utf-8');
  html = injectState(html, null);
  
  reply.type('text/html');
  reply.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  return html;
});

try {
  await app.listen({ port: PORT });
  console.log(`Fastify server running on http://localhost:${PORT}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}