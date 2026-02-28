const { execSync } = require('child_process');

let diffCommand = '';
const args = process.argv.slice(2);
let localBase = null;
let localHead = null;

for (let i = 0; i < args.length; i++) {
    if (args[i] === '--base' && args[i + 1]) {
        localBase = args[i + 1];
        i++;
    } else if (args[i] === '--head' && args[i + 1]) {
        localHead = args[i + 1];
        i++;
    }
}

if (localBase && localHead) {
    diffCommand = `git diff --name-only "${localBase}...${localHead}"`;
} else if (process.env.GITHUB_BASE_REF) {
    diffCommand = `git diff --name-only "origin/${process.env.GITHUB_BASE_REF}...${process.env.GITHUB_SHA || 'HEAD'}"`;
} else if (process.env.BEFORE) {
    const before = process.env.BEFORE;
    const head = process.env.GITHUB_SHA || 'HEAD';
    if (before.match(/^0+$/) || !before) {
        diffCommand = `git diff-tree --no-commit-id --name-only -r "${head}"`;
    } else {
        diffCommand = `git diff --name-only "${before}..${head}"`;
    }
} else {
    console.error("❌ ERROR: --base and --head arguments required for local execution.");
    process.exit(1);
}

try {
    let changedFiles = [];

    // 1) Committed diffs
    try {
        const diffOutput = execSync(diffCommand, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
        changedFiles.push(...diffOutput.split('\n').filter(Boolean));
    } catch (e) {
        // Ignore error if diff fails (e.g. branch doesn't exist locally yet)
    }

    // 2) Local working tree changes (staged/unstaged/untracked)
    const statusOutput = execSync('git status --porcelain', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
    const statusLines = statusOutput.split('\n').filter(Boolean);
    for (const line of statusLines) {
        const filePath = line.substring(3).trim();
        const cleanPath = filePath.replace(/^"(.*)"$/, '$1'); // Remove surrounding quotes if any
        changedFiles.push(cleanPath);
    }

    // Remove duplicates
    changedFiles = [...new Set(changedFiles)];

    const forbiddenFiles = changedFiles.filter(file => {
        const normalizedPath = file.replace(/\\/g, '/');
        return normalizedPath.startsWith('pins_studio/');
    });

    if (forbiddenFiles.length > 0) {
        console.error('❌ ERROR: FORBIDDEN CHANGES DETECTED.');
        forbiddenFiles.forEach(f => console.error(`  - ${f}`));
        process.exit(1);
    } else {
        console.log('✅ PASS: No forbidden legacy changes detected.');
        process.exit(0);
    }
} catch (error) {
    console.error('❌ ERROR: Failed to run git checks.');
    process.exit(1);
}
