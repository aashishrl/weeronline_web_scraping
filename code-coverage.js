const fs = require('fs').promises;
const puppeteer = require('puppeteer');

async function scrapeCookieBanner() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.weeronline.nl/');

    // Extract titles and descriptions of cookie banners
    const cookieBanners = await page.evaluate(() => {
        const title = document.querySelector('.fc-header h1').innerText;

        const permissionElements = document.querySelectorAll('.fc-stacks .fc-stack-name');
        const permissions = Array.from(permissionElements, element => element.innerText.trim());

        return [{
            title: title,
            permissions: permissions,
        }];
    });

    await browser.close();

    return cookieBanners;
}

async function readScrapedDataFromFile() {
    try {
        const data = await fs.readFile('check.json', 'utf8');
        const scrapedData = JSON.parse(data);
        return [scrapedData]; // Wrap the scraped data object in an array
    } catch (error) {
        console.error('Error reading scraped data file:', error);
        return null; // Return null if there's an error reading the file
    }
}


async function calculateDataCoverage() {
    const scrapedData = await readScrapedDataFromFile();
    const cookieBanners = await scrapeCookieBanner();

    let totalDataPoints = 0;
    let scrapedDataPoints = 0;

    // Check if scrapedData is an array
    if (!Array.isArray(scrapedData)) {
        console.error('Scraped data is not in the expected format.');
        return 0; // Return 0 coverage if scraped data is not in the expected format
    }

    // Count the total number of data points
    scrapedData.forEach(scrapedBanner => {
        if (scrapedBanner.cookieBanner) {
            totalDataPoints += Object.keys(scrapedBanner.cookieBanner).length;
        }
    });

    // Count the number of scraped data points
    cookieBanners.forEach(cookieBanner => {
        scrapedData.forEach(scrapedBanner => {
            if (
                scrapedBanner.cookieBanner &&
                cookieBanner.title === scrapedBanner.cookieBanner.title &&
                JSON.stringify(cookieBanner.permissions) === JSON.stringify(scrapedBanner.cookieBanner.permissions)
            ) {
                scrapedDataPoints += Object.keys(scrapedBanner.cookieBanner).length;
            }
        });
    });

    // Calculate the data coverage percentage
    const dataCoveragePercentage = totalDataPoints === 0 ? 0 : (scrapedDataPoints / totalDataPoints) * 100;
    return dataCoveragePercentage;
}


// Run the calculation and log the result
calculateDataCoverage().then(coveragePercentage => {
    console.log(`Data coverage percentage: ${coveragePercentage.toFixed(2)}%`);
}).catch(error => {
    console.error('Error calculating data coverage:', error);
});


