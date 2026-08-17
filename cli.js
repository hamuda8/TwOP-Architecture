#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

// Setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function init() {
    console.log('\n🚀 Welcome to the TwOP Architecture Generator\n');

    // 1. Get Project Name
    let projectName = await question('Project name (e.g., my-twop-app): ');
    projectName = projectName.trim() || 'my-twop-app';
    const targetPath = path.join(process.cwd(), projectName);

    if (fs.existsSync(targetPath)) {
        console.error(`\n❌ Directory '${projectName}' already exists. Please choose a different name.\n`);
        process.exit(1);
    }

    // 2. Discover available parts dynamically
    const privatePartsDir = path.join(__dirname, 'private');
    const publicPartsDir = path.join(__dirname, 'public');

    const backends = fs.readdirSync(privatePartsDir).filter(f => fs.statSync(path.join(privatePartsDir, f)).isDirectory());
    const frontends = fs.readdirSync(publicPartsDir).filter(f => fs.statSync(path.join(publicPartsDir, f)).isDirectory());

    // 3. Prompt for Backend
    console.log('\nSelect your Private Origin (Backend):');
    backends.forEach((b, i) => console.log(`  ${i + 1}. ${b}`));
    const backendIndex = parseInt(await question('Enter number: ')) - 1;
    const selectedBackend = backends[backendIndex] || backends[0];

    // 4. Prompt for Frontend
    console.log('\nSelect your Public Origin (Frontend):');
    frontends.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
    const frontendIndex = parseInt(await question('Enter number: ')) - 1;
    const selectedFrontend = frontends[frontendIndex] || frontends[0];

    rl.close();

    console.log(`\n⚙️  Assembling ${projectName} using [${selectedBackend}] + [${selectedFrontend}]...`);

    // 5. Execute Copy Rules
    fs.mkdirSync(targetPath, { recursive: true });

    // Rule 1: Copy Backend contents to the Root
    const backendSource = path.join(privatePartsDir, selectedBackend);
    fs.cpSync(backendSource, targetPath, { recursive: true });

    // Rule 2: Copy Frontend contents into the Public folder
    const frontendSource = path.join(publicPartsDir, selectedFrontend);
    const frontendDest = path.join(targetPath, 'public');
    
    if (!fs.existsSync(frontendDest)) {
        fs.mkdirSync(frontendDest, { recursive: true });
    }
    
    fs.cpSync(frontendSource, frontendDest, { recursive: true });

    console.log('\n✅ TwOP Architecture successfully generated!');
    console.log(`\nNext steps:`);
    console.log(`  cd ${projectName}`);
    console.log(`  node app.js (or equivalent backend runner)\n`);
}

init().catch(err => {
    console.error("\n❌ An error occurred:", err.message);
    process.exit(1);
});