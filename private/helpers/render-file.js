import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { safeJson } from './safe-json.js';

export async function renderFile(res, relativePath, state = null) {
    try {
        const filePath = resolve('./public', relativePath);
        let html = await readFile(filePath, 'utf-8');

        // Inject state directly into the DOM
        if (state) {
            const stateScript = `<script>window.__STATE__ = ${safeJson(state)};</script>\n`;
            if (html.includes('</head>')) {
                html = html.replace('</head>', `${stateScript}</head>`);
            } else {
                html = stateScript + html;
            }
        }

        res.writeHead(200, { 
            'Content-Type': 'text/html',
            'Cache-Control': 'no-store, no-cache, must-revalidate, private'
        });
        res.end(html);

    } catch (err) {
        console.error('Error rendering file:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
    }
}