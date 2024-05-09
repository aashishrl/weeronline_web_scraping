const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function scrapeWebsiteData() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.weeronline.nl/");

    const websiteData = await page.evaluate(() => {
        const container = document.querySelector('.fc-dialog.fc-vendor-preferences-dialog .fc-preferences-container');
        const supplierPreferenceList = Array.from(container.querySelectorAll('.fc-preference-container'), (e) => {
            const pDescription = ".fc-preference-description .fc-iab-vendor-storage-info-container"

            const title = e.querySelector('.fc-preference-title h2').innerText;
            const cookieDuration = e.querySelector(`${pDescription} p`);
            const text = e.querySelector(`${pDescription} .fc-vendor-data-categories p`);
            const cookieReset = e.querySelector(`${pDescription} p:last-child`);

            const links = Array.from(e.querySelectorAll('.fc-preference-description > a')).map(a => a.innerText);

            const consentCheckbox1 = e.querySelector('.fc-consent-preference-container .fc-preference-slider-label')
            const consentCheckbox2 = e.querySelector('.fc-legitimate-interest-preference-container .fc-preference-slider-label')

            return {
                title: title,
                description: {
                    cookieDuration: cookieDuration ? cookieDuration.innerText : '',
                    text: text ? text.innerText : '',
                    cookieReset: cookieReset ? cookieReset.innerText : ''
                },
                links: links,
                consentCheckbox1: consentCheckbox1 ? consentCheckbox1.innerText : '',
                consentCheckbox2: consentCheckbox2 ? consentCheckbox2.innerText : '',
            };
        });
        return supplierPreferenceList;
    });

    await browser.close();
    return websiteData;
}


async function readScrapedDataFromFile() {
    try {
        const data = await fs.readFile('pdata.json', 'utf8');
        const scrapedData = JSON.parse(data);
        console.log(scrapedData);
        // return scrapedData; // Return the scraped data object directly
    } catch (error) {
        console.error('Error reading scraped data file:', error);
        return null; // Return null if there's an error reading the file
    }
}
readScrapedDataFromFile()

// async function calculateMatchingPercentage(data1, data2) {
//     let totalKeys = 0;
//     let matchingKeys = 0;

//     // Helper function to recursively compare nested objects and arrays
//     function compare(obj1, obj2) {
//         for (let key in obj1) {
//             if (obj2.hasOwnProperty(key)) {
//                 if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
//                     compare(obj1[key], obj2[key]); // Recursively compare nested objects
//                 } else if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
//                     // If both values are arrays, compare their elements
//                     let minArrayLength = Math.min(obj1[key].length, obj2[key].length);
//                     for (let i = 0; i < minArrayLength; i++) {
//                         if (obj1[key][i] === obj2[key][i]) {
//                             matchingKeys++;
//                         }
//                         totalKeys++;
//                     }
//                 } else {
//                     // If both values are simple types (strings, numbers, etc.), compare them directly
//                     if (obj1[key] === obj2[key]) {
//                         matchingKeys++;
//                     }
//                     totalKeys++;
//                 }
//             }
//         }
//     }

//     // Call the helper function to start the comparison
//     compare(data1, data2);

//     // Calculate the percentage
//     let percentage = (matchingKeys / totalKeys) * 100;
//     return percentage.toFixed(2) + "%"; // Round to two decimal places
// }

// // Main function to compare website data with scraped data
// async function compareWebsiteWithScrapedData() {
//     const scrapedDataFilePath = 'weeronline_webscraping.json'; // Adjust the file path as per your directory structure

//     // Scrape data from the website
//     const websiteData = await scrapeWebsiteData();

//     // Read scraped data from file
//     const scrapedData = await readScrapedDataFromFile(scrapedDataFilePath);

//     // Calculate the matching percentage
//     if (websiteData && scrapedData) {
//         const matchingPercentage = await calculateMatchingPercentage(websiteData, scrapedData);
//         console.log("Matching Percentage:", matchingPercentage);
//     } else {
//         console.log("Failed to compare data. Please make sure the data is available.");
//     }
// }

// // Run the comparison
// compareWebsiteWithScrapedData();
