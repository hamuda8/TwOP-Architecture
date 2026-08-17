import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { join, extname, resolve } from 'path';
import { helloWorldRoute } from './private/routes/hello-world.js';

// Environment variables (Node v20+ supports --env-file)
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = resolve('./public');

const CONTENT_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain',
    '.webmanifest': 'application/manifest+json'
};

const server = createServer(async (req, res) => {
    try {
        // 1. Static File Serving (Public Origin)
        if (req.url !== '/' && req.url.startsWith('/')) {
            const filePath = join(PUBLIC_DIR, req.url.split('?')[0]);
            try {
                const ext = extname(filePath).toLowerCase();
                const contentType = CONTENT_TYPES[ext] || 'application/octet-stream';
                const data = await readFile(filePath);
                
                // Cache control for static assets
                res.writeHead(200, { 
                    'Content-Type': contentType,
                    'Cache-Control': 'public, max-age=86400' 
                });
                res.end(data);
                return; 
            } catch (err) {
                // File not found; allow routing to handle 404s
            }
        }

        // 2. Dynamic Routing (Private Origin)
        await helloWorldRoute(req, res);

    } catch (err) {
        // Global Error Handler
        console.error('🔥 Server error:', err);
        if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Internal Server Error' }));
        }
    }
});

// Top-Level Startup Execution
try {
    // Add database connections here in the future
    server.listen(PORT, () => {
        console.log(`🚀 Vanilla TwOP Engine running on port ${PORT}`);
    });
} catch (err) {
    console.error("❌ Fatal startup error:", err);
    process.exit(1);
}