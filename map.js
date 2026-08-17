import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function printTree(dir, prefix = '') {
    const files = fs.readdirSync(dir);
    
    files.forEach((file, index) => {
        // Ignore node_modules, .git, and the archive folder you just made
        if (file === 'node_modules' || file === '.git' || file === '.DS_Store' || file === '_archive') return; 
        
        const isLast = index === files.length - 1;
        const filePath = path.join(dir, file);
        
        try {
            const stat = fs.statSync(filePath);
            console.log(`${prefix}${isLast ? '└── ' : '├── '}${file}`);
            
            if (stat.isDirectory()) {
                printTree(filePath, prefix + (isLast ? '    ' : '│   '));
            }
        } catch (err) {
            // Skip if permission error or file missing
        }
    });
}

console.log('--- Project Map (TwOP Architecture) ---');
printTree(__dirname);