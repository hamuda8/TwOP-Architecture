import { renderFile } from '../helpers/render-file.js';

export async function serveDemoPage(res) {
    // Example of passing state from the backend directly to the frontend
    const serverState = {
        message: "Welcome to the Vanilla TwOP Architecture",
        timestamp: Date.now()
    };

    await renderFile(res, 'markup/index.html', serverState);
}