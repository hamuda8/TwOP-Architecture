import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The output file where all contents will be saved
const outputFile = path.join(__dirname, 'project_codebase.md');

// Initialize the file
fs.writeFileSync(outputFile, '# Project Contents\n\n', 'utf8');

function exportTreeAndContents(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach((file) => {
        // Skip requested items, plus our script and output file to avoid infinite loops
        if (
            file === 'node_modules' || 
            file === '.git' || 
            file === '.DS_Store' || 
            file === '_archive' ||
            file === '.env' ||
            file === '.gitignore' ||
            file === 'project_codebase.md' ||
            file === 'assets' ||
            file === 'export_contents.js'
        ) return; 
        
        const filePath = path.join(dir, file);
        
        try {
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                // Recursively check directories
                exportTreeAndContents(filePath);
            } else if (stat.isFile()) {
                // Skip common binary files (images) so they don't break the text file
                if (/\.(png|jpe?g|gif|svg|ico|webp)$/i.test(file)) return;

                const relativePath = path.relative(__dirname, filePath);
                console.log(`Exporting: ${relativePath}`);
                
                const content = fs.readFileSync(filePath, 'utf8');
                
                // Format nicely for md
                const ext = path.extname(file).replace('.', '');
                const fileHeader = `\n## ${relativePath}\n\`\`\`${ext}\n`;
                const fileFooter = `\n\`\`\`\n`;
                
                fs.appendFileSync(outputFile, fileHeader + content + fileFooter, 'utf8');
            }
        } catch (err) {
            console.error(`Could not process ${filePath}: ${err}`);
        }
    });
}

console.log('--- Starting export ---');
exportTreeAndContents(__dirname);
console.log(`--- Finished! Exported to ${outputFile} ---`);