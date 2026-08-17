import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { join, extname } from 'path';
import { helloWorldRoute } from './private/routes/hello-world.js';
import { logHello } from './private/helpers/helper.js';

const PORT = 3000;
const PUBLIC_DIR = './public';

const CONTENT_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
};

const server = createServer(async (req, res) => {
  try {
    // Check if request is for a public file
    if (req.url !== '/' && req.url.startsWith('/')) {
      const filePath = join(PUBLIC_DIR, req.url);

      try {
        const ext = extname(filePath).toLowerCase();
        const contentType = CONTENT_TYPES[ext] || 'application/octet-stream';
        const data = await readFile(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
        return; // Stop here, file served
      } catch (err) {
        // If file not found, continue to routes
      }
    }

    // Pass everything else to routes
    await helloWorldRoute(req, res);
    logHello('World');
  } catch (err) {
    console.error('Server error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});