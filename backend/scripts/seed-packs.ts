/**
 * seed-packs.ts
 * Creates 5 packs and adds ~200 items each from the JSON URL files.
 * Usage: npx ts-node scripts/seed-packs.ts
 */
import * as fs from 'fs';
import * as path from 'path';

const API = process.env.API_URL || 'http://localhost:4000';

interface Pack { id: string; name: string; slug: string }

const PACKS = [
    { name: 'Web Design & UI/UX', slug: 'seed-web-design-uiux', file: 'pack-urls-1.json' },
    { name: 'Tech & AI Ecosystem', slug: 'seed-tech-ai-ecosystem', file: 'pack-urls-2.json' },
    { name: 'DevOps & Cloud', slug: 'seed-devops-cloud', file: 'pack-urls-3.json' },
    { name: 'Creative Tools & Media', slug: 'seed-creative-tools-media', file: 'pack-urls-4.json' },
    { name: 'Education & Security', slug: 'seed-education-security', file: 'pack-urls-5.json' },
];

async function apiPost(url: string, body: any) {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok && res.status !== 201) {
        const text = await res.text();
        throw new Error(`POST ${url} → ${res.status}: ${text}`);
    }
    return res.json();
}

async function apiGet(url: string) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
    return res.json();
}

async function findOrCreatePack(name: string, slug: string): Promise<Pack> {
    // Check if pack already exists by listing all packs
    const packs: Pack[] = await apiGet(`${API}/packs`);
    const existing = packs.find((p: any) => p.slug === slug);
    if (existing) {
        console.log(`  ✔ Pack "${name}" already exists (${existing.id})`);
        return existing;
    }
    const created = await apiPost(`${API}/packs`, { name, slug, description: `Seed pack: ${name}` });
    console.log(`  ✚ Created pack "${name}" (${created.id})`);
    return created;
}

async function addItemsBatch(packId: string, urls: string[]) {
    // API accepts { urls: string[] } via AddPackItemsDto
    const batchSize = 100;
    let totalAdded = 0;
    for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        try {
            const result = await apiPost(`${API}/packs/${packId}/items`, { items: batch.map(u => ({ sourceUrl: u })) });
            const count = result.count || batch.length;
            totalAdded += count;
            console.log(`    Batch ${Math.floor(i / batchSize) + 1}: +${count} items`);
        } catch (err: any) {
            console.error(`    Batch ${Math.floor(i / batchSize) + 1} failed: ${err.message}`);
        }
    }
    return totalAdded;
}

async function main() {
    console.log('=== Pins-Studio: Seed Packs ===\n');

    let totalItems = 0;

    for (const packDef of PACKS) {
        console.log(`\nPack: ${packDef.name}`);

        // Load URLs from JSON
        const jsonPath = path.join(__dirname, 'packs', packDef.file);
        if (!fs.existsSync(jsonPath)) {
            console.error(`  ✗ File not found: ${jsonPath}`);
            continue;
        }
        const urls: string[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        console.log(`  URLs in file: ${urls.length}`);

        // Find or create the pack
        const pack = await findOrCreatePack(packDef.name, packDef.slug);

        // Add items
        const added = await addItemsBatch(pack.id, urls);
        totalItems += added;
        console.log(`  Total items added for this pack: ${added}`);
    }

    console.log(`\n=== Summary ===`);
    console.log(`Packs: ${PACKS.length}`);
    console.log(`Total items seeded: ${totalItems}`);
    console.log('Done.');
}

main().catch((err) => {
    console.error('Fatal:', err.message);
    process.exit(1);
});
