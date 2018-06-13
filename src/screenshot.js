const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function run(data, page, currentIndex, dest) {
    if (currentIndex === data.length) {
        return { success: true };
    }

    let url = data[currentIndex].homepage ||  '';
    if (url.length > 0) {
        if (!url.startsWith('http')) {
            url = `http://${url}`;
        }

        try {
            await page.goto(url);

            const filename = path.resolve('images', `${data[currentIndex].name}.jpeg`);

            if (!fs.existsSync(filename)) {
                await page.screenshot({ path: filename, quality: 80 });
            }
        } catch (err) {
            console.error(`Error fetching page for ${url}`, err);
            return run(data, page, currentIndex + 1);
        }
    }

    return run(data, page, currentIndex + 1, dest);
};

module.exports = async (dest, projects) => {
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  const res = await run(projects, page, 0, dest);
  browser.close();
}
