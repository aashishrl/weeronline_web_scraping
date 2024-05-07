const fs = require('fs').promises;
const puppeteer = require('puppeteer');

async function scrapeCookieBanner() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.weeronline.nl/');

    // Extract titles and descriptions of cookie banners
    const cookieBanners = await page.evaluate(async () => {
        const title = document.querySelector('.fc-header h1').innerText;

        const permissionElements = document.querySelectorAll('.fc-stacks .fc-stack-name');
        const permissions = Array.from(permissionElements, element => element.innerText.trim());

        // Manage Options Page PreferenceList logic
        const preferenceList = Array.from(document.querySelector('.fc-preferences-container').querySelectorAll('.fc-preference-container'), (e) => ({
            title: e.querySelector('.fc-preference-title h2').innerText,
            description: e.querySelector('.fc-preference-description .fc-purpose-feature-description').innerText,
            consent: e.querySelector('.fc-consent-preference-container') ? e.querySelector('.fc-consent-preference-container').innerText : '',
            legitimateInterest: e.querySelector('.fc-legitimate-interest-preference-container') ? e.querySelector('.fc-legitimate-interest-preference-container').innerText : '',
        }));
        
        return {
            title: title,
            permissions: permissions,
            manageOptions: {    
                preferenceList: preferenceList,
            },
        };
    });

    await browser.close();

    return cookieBanners;
}

async function readScrapedDataFromFile() {
    try {
        const data = await fs.readFile('weeronline_webscraping.json', 'utf8');
        const scrapedData = JSON.parse(data);
        return scrapedData; // Return the scraped data object directly
    } catch (error) {
        console.error('Error reading scraped data file:', error);
        return null; // Return null if there's an error reading the file
    }
}

async function compareScrapedData() {
    try {
        const scrapedData = await readScrapedDataFromFile();

        // Check if scraped data is null or not in the expected format
        if (!scrapedData || !scrapedData.manageOptionsButton || !scrapedData.manageOptionsButton.preferenceList) {
            console.error('Scraped data is not in the expected format.');
            return { mismatches: [], coveragePercentage: 0 };
        }

        const scrapedPreferenceList = scrapedData.manageOptionsButton.preferenceList;
        const cookieBanners = await scrapeCookieBanner();
        const websitePreferenceList = cookieBanners.manageOptions.preferenceList;

        // Check if the lengths are equal
        if (scrapedPreferenceList.length !== websitePreferenceList.length) {
            console.error('Lengths of preference lists are different.');
            return { mismatches: [], coveragePercentage: 0 };
        }

        let matchingItems = 0;

        // Compare each preference list item
        const mismatches = [];
        for (let i = 0; i < scrapedPreferenceList.length; i++) {
            const scrapedItem = scrapedPreferenceList[i];
            const websiteItem = websitePreferenceList[i];

            // Compare specific properties like title, description, consent, legitimateInterest
            if (
                scrapedItem.title !== websiteItem.title ||
                scrapedItem.description !== websiteItem.description ||
                scrapedItem.consent !== websiteItem.consent ||
                scrapedItem.legitimateInterest !== websiteItem.legitimateInterest
            ) {
                mismatches.push(`Mismatch found in preference list item ${i + 1}`);
            } else {
                matchingItems++;
            }
        }

        const coveragePercentage = (matchingItems / scrapedPreferenceList.length) * 100;

        return { mismatches, coveragePercentage };
    } catch (error) {
        console.error('Error comparing scraped data:', error);
        return { mismatches: [], coveragePercentage: 0 };
    }
}


// Run the comparison
compareScrapedData().then(mismatches => {
    if (mismatches.length === 0) {
        console.log('No mismatches found. Data is consistent.');
    } else {
        console.log('Mismatches found:');
        mismatches.forEach(mismatch => console.error(mismatch));
    }
}).catch(error => {
    console.error('Error comparing scraped data:', error);
});
