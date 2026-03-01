const http = require('http');

async function testRepair() {
    console.log("Fetching pins...");
    const res = await fetch("http://localhost:4000/pins");
    const data = await res.json();
    const pins = data.items;

    if (!pins || pins.length < 2) {
        console.error("Need at least 2 pins. Found:", pins ? pins.length : 0);
        return;
    }

    const pinOriginal = pins[0];
    const pinSource = pins[1];

    console.log(`Testing Suggestions for Pin: ${pinOriginal.id}`);

    // Login first? Wait, do I need to be logged in? 
    // Let's get an auth cookie if required.
    // In controller I used @UseGuards(JwtCookieGuard)
    let cookieHeader = '';
    const loginRes = await fetch("http://localhost:4000/auth/dev-login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: "admin@pins.studio", name: "Admin" })
    });
    const cookies = loginRes.headers.getSetCookie();
    if (cookies) {
        cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');
        console.log("Logged in, got cookies.");
    }

    const suggRes = await fetch(`http://localhost:4000/pins/${pinOriginal.id}/repair/suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cookie': cookieHeader },
        body: JSON.stringify({ reason: "open_failed" })
    });
    const suggData = await suggRes.json();
    console.log("Suggestions Response:", JSON.stringify(suggData, null, 2));

    console.log(`\nTesting Apply Repair using Pin: ${pinSource.id}`);
    const applyRes = await fetch(`http://localhost:4000/pins/${pinOriginal.id}/repair/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cookie': cookieHeader },
        body: JSON.stringify({ sourcePinId: pinSource.id })
    });

    const applyData = await applyRes.json();
    console.log(`Apply Response (${applyRes.status}):`, JSON.stringify(applyData, null, 2));

    console.log(`\nTesting Conflict... applying same source to pinOriginal again! Wait, the canonicalUrl will be the SAME as pinSource!`);
    // If we applied it successfully the first time, pinOriginal NOW HAS pinSource's canonical url. That shouldn't have worked if it violates uniqueness EXCEPT that Prisma allows you to update your own canonicalUrl to be the same if it already was? No, pinSource ALREADY exists with that canonicalUrl.
    // Wait! If pinSource already has canonicalUrl='https://example.com', and we update pinOriginal to ALSO have 'https://example.com', Prisma WILL throw P2002 because canonicalUrl is UNIQUE in the schema.
    // So the FIRST apply attempt should actually FAIL with 409 Conflict if canonicalUrl is truly unique and pinSource hasn't been deleted.
    // Let's see what happens.
}

testRepair().catch(console.error);
