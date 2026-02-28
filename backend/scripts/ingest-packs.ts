/**
 * ingest-packs.ts
 * Triggers async ingestion for all seed packs and polls until completion.
 * Usage: npx ts-node scripts/ingest-packs.ts
 */

const API = process.env.API_URL || 'http://localhost:4000';

interface Pack { id: string; name: string; slug: string }

const SEED_SLUGS = [
    'seed-web-design-uiux',
    'seed-tech-ai-ecosystem',
    'seed-devops-cloud',
    'seed-creative-tools-media',
    'seed-education-security',
];

async function apiGet(url: string) {
    const res = await fetch(url);
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`GET ${url} → ${res.status}: ${text}`);
    }
    return res.json();
}

async function apiPost(url: string) {
    const res = await fetch(url, { method: 'POST' });
    if (!res.ok && res.status !== 202) {
        const text = await res.text();
        throw new Error(`POST ${url} → ${res.status}: ${text}`);
    }
    return res.json();
}

function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
}

async function pollJobStatus(jobId: string): Promise<any> {
    const maxAttempts = 300; // 5 minutes at 1s intervals
    for (let i = 0; i < maxAttempts; i++) {
        const status = await apiGet(`${API}/jobs/${jobId}`);
        if (status.status === 'completed') {
            return status;
        }
        if (status.status === 'failed') {
            console.error(`  ✗ Job ${jobId} failed: ${status.error}`);
            return status;
        }
        // Still waiting/active
        if (i % 10 === 0) {
            console.log(`  ⏳ Job ${jobId}: ${status.status} (progress: ${status.progress || 0}%)`);
        }
        await sleep(1000);
    }
    console.error(`  ✗ Job ${jobId} timed out after ${maxAttempts}s`);
    return null;
}

async function main() {
    console.log('=== Pins-Studio: Ingest Packs ===\n');

    // Get all packs
    const allPacks: Pack[] = await apiGet(`${API}/packs`);
    const seedPacks = allPacks.filter((p: any) => SEED_SLUGS.includes(p.slug));

    if (seedPacks.length === 0) {
        console.error('No seed packs found. Run seed:packs first.');
        process.exit(1);
    }

    console.log(`Found ${seedPacks.length} seed packs to ingest.\n`);

    const results: { name: string; jobId: string; status: any }[] = [];

    for (const pack of seedPacks) {
        console.log(`Ingesting: ${pack.name} (${pack.id})`);
        try {
            const { jobId } = await apiPost(`${API}/jobs/ingest-pack/${pack.id}`);
            console.log(`  ✚ Enqueued job: ${jobId}`);

            // Poll until done
            const finalStatus = await pollJobStatus(jobId);
            results.push({ name: pack.name, jobId, status: finalStatus });

            if (finalStatus?.result) {
                const r = finalStatus.result;
                console.log(`  ✔ Completed: processed=${r.processed}, ingested=${r.ingested}, deduped=${r.deduped}, failed=${r.failed}`);
            }
        } catch (err: any) {
            console.error(`  ✗ Error: ${err.message}`);
            results.push({ name: pack.name, jobId: 'N/A', status: { error: err.message } });
        }
        console.log('');
    }

    // Summary
    console.log('=== Ingestion Summary ===');
    for (const r of results) {
        const s = r.status?.result;
        if (s) {
            console.log(`  ${r.name}: ingested=${s.ingested}, deduped=${s.deduped}, failed=${s.failed}`);
        } else {
            console.log(`  ${r.name}: ${r.status?.error || 'unknown'}`);
        }
    }

    console.log('\nDone. Verify pin count with: npx prisma studio');
}

main().catch((err) => {
    console.error('Fatal:', err.message);
    process.exit(1);
});
