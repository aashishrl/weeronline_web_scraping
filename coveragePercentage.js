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

            const consentCheckbox1 = e.querySelector('.fc-consent-preference-container .fc-preference-slider-label')
            const consentCheckbox2 = e.querySelector('.fc-legitimate-interest-preference-container .fc-preference-slider-label')

            return {
                title: title,
                description: {
                    cookieDuration: cookieDuration ? cookieDuration.innerText : '',
                    text: text ? text.innerText : '',
                    cookieReset: cookieReset ? cookieReset.innerText : ''
                },
                // links: links,
                consentCheckbox1: consentCheckbox1 ? consentCheckbox1.innerText : '',
                consentCheckbox2: consentCheckbox2 ? consentCheckbox2.innerText : '',
            };
        });
        return supplierPreferenceList;
    });

    await browser.close();
    return websiteData;
}
// console.log(scrapedData)

async function readScrapedDataFromFile() {
    try {
        const data = await fs.readFile('check.json', 'utf8');
        const scrapedData = JSON.parse(data);
        // console.log(scrapedData);
        return scrapedData; // Return the scraped data object directly
    } catch (error) {
        console.error('Error reading scraped data file:', error);
        return null; // Return null if there's an error reading the file
    }
}

async function calculateDataCoveragePercentage() {
    try {
        // Scrape website data
        const websiteData = await scrapeWebsiteData();

        // Read scraped data from file
        const scrapedData = await readScrapedDataFromFile();

        // Ensure both websiteData and scrapedData are available
        if (!websiteData || !scrapedData) {
            console.log("Failed to compare data. Please make sure the data is available.");
            return;
        }

        // Get the supplier preference lists from both websiteData and scrapedData
        const websiteSupplierList = websiteData;
        const scrapedSupplierList = scrapedData.cookieBanner.manageOptionsButton.supplierPreferencePage.supplierPreferenceList;

        // Function to compare supplierPreferenceList arrays
        function compareSupplierPreferenceLists(list1, list2) {
            let totalKeys = 0;
            let matchingKeys = 0;
            let mismatchedObjects = []; // Array to store indices of mismatched objects

            // Check if both arrays exist
            if (!list1 || !list2) {
                console.log("Unable to compare supplier preference lists. Data structure mismatch or empty arrays.");
                return;
            }

            // Log the lengths of the arrays
            console.log("Length of list1:", list1.length);
            console.log("Length of list2:", list2.length);

            // Check if the lengths of the arrays are equal
            if (list1.length !== list2.length) {
                console.log("Unable to compare supplier preference lists. Arrays have different lengths.");
                // Log the difference in lengths
                console.log("Difference in lengths: ", Math.abs(list1.length - list2.length));
                return;
            }

            // Compare each supplier preference object
            for (let i = 0; i < list1.length; i++) {
                const supplier1 = list1[i];
                const supplier2 = list2[i];

                // Check if the titles of the suppliers exist
                if (!supplier1 || !supplier2 || !supplier1.title || !supplier2.title) {
                    console.log("Skipping comparison for index", i, "due to missing title.");
                    continue;
                }

                // Check if the titles of the suppliers match
                if (supplier1.title === supplier2.title) {
                    matchingKeys++; // Increment matchingKeys counter
                } else {
                    // Log the index of the mismatched object
                    mismatchedObjects.push(i);
                }

                totalKeys++; // Increment totalKeys counter
            }

            // Calculate the percentage
            let percentage = (matchingKeys / totalKeys) * 100;
            console.log("Data Coverage Percentage:", percentage.toFixed(2) + "%");

            // Log indices of mismatched objects
            if (mismatchedObjects.length > 0) {
                console.log("Indices of objects with mismatched keys:", mismatchedObjects);
            } else {
                console.log("All objects have matching keys.");
            }
        }

        // Calculate the matching percentage
        compareSupplierPreferenceLists(websiteSupplierList, scrapedSupplierList);
    } catch (error) {
        console.error('Error comparing data:', error);
    }
}

// Run the comparison
calculateDataCoveragePercentage();


