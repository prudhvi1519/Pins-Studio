const puppeteer = require('puppeteer');
const { spawn } = require('child_process');

(async () => {
    // Start dev server
    const server = spawn('npm', ['run', 'dev'], { shell: true });

    // Wait a bit for server to start
    await new Promise(r => setTimeout(r, 6000));

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set mobile viewport to make bottom nav obvious
    await page.setViewport({ width: 390, height: 844 });

    // Screenshot A: Home
    await page.goto('http://localhost:5173');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'screenshot_a_home.png' });

    // Screenshot B: Search
    await page.goto('http://localhost:5173/search');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'screenshot_b_search.png' });

    console.log('Screenshots captured successfully: screenshot_a_home.png, screenshot_b_search.png');

    await browser.close();
    server.kill();
    process.exit(0);
})();
