import { serveDemoPage } from '../services/hello-world.js';

export async function helloWorldRoute(req, res) {
  try {
    if (req.url === '/') {
      // Delegate all logic to the service
      await serveDemoPage(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Internal Server Error');
  }
}