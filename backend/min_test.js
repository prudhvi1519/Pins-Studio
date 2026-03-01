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

    let cookieHeader = '';
    const loginRes = await fetch("http://localhost:4000/auth/dev-login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: "admin@pins.studio", name: "Admin" })
    });
    const cookies = loginRes.headers.getSetCookie();
    cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

    const suggRes = await fetch(`http://localhost:4000/pins/${pinOriginal.id}/repair/suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cookie': cookieHeader },
        body: JSON.stringify({ reason: "open_failed" })
    });
    const suggData = await suggRes.json();
    console.log(`Suggestions: ${suggData.suggestions.length} items returned.`);

    const applyRes = await fetch(`http://localhost:4000/pins/${pinOriginal.id}/repair/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cookie': cookieHeader },
        body: JSON.stringify({ sourcePinId: pinSource.id })
    });
    const applyData = await applyRes.json();
    console.log(`Apply Code: ${applyRes.status}, Message: ${applyData.message}`);

    const conflictRes = await fetch(`http://localhost:4000/pins/${pinOriginal.id}/repair/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cookie': cookieHeader },
        body: JSON.stringify({ sourcePinId: pinSource.id })
    });
    console.log(`Conflict Code: ${conflictRes.status}`);
}

testRepair().catch(console.error);
