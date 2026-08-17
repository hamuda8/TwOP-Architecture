import { readFile } from 'fs/promises';
import { resolve } from 'path';

export async function serveDemoPage(res) {
  try {
    const filePath = resolve('./public/markup/index.html');
    const html = await readFile(filePath, 'utf-8');

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);

  } catch (err) {
    console.error('Error serving demo page:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Internal Server Error');
  }
}