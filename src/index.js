// const fs = require('fs');
// const puppeteer = require('puppeteer');
// const { moreInformation } = require('./moreInformation');
// const { manageOptions } = require('./manageOptions');
// const { supplierPreference } = require('./rough');

// async function scrapeAndTranslate() {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto('https://www.weeronline.nl/');

//     const moreInfoData = await moreInformation(page);
//     const manageOptionsData = await manageOptions(page);
//     const supplierPreferenceData = await supplierPreference(page);

//     const scrapedTitle = await page.evaluate((moreInfoData, manageOptionsData,supplierPreferenceData) => {
//         const title = document.querySelector('.fc-dialog-headline').innerText;

//         const permissionElements = document.querySelectorAll('.fc-stacks.fc-dialog-restricted-content ul li .fc-stack-name');
//         const permissions = Array.from(permissionElements, element => element.innerText.trim());

//         const additionalInfoElements = document.querySelectorAll('.fc-footer.fc-dialog-restricted-content p');
//         const additionalInfo = Array.from(additionalInfoElements, element => element.innerText.trim());

//         const moreInfo = moreInfoData; 

//         const buttonElements = Array.from(document.querySelectorAll('.fc-footer-buttons .fc-button')).slice(0, 2);
//         const buttons = Array.from(buttonElements, element => element.innerText.trim());

//         const manageOptionsButton = manageOptionsData; 

//         const supplierPreferencePage = supplierPreferenceData; 
        
//         return {
//             cookieBanner:{
//                 title: title,
//                 permissions: permissions,
//                 additionalInfo: additionalInfo,
//                 moreInfo: moreInfo,
//                 buttons: buttons,
//                 manageOptionsButton: manageOptionsButton,
//                 supplierPreferencePage: supplierPreferencePage,
//             }
//         };
//     }, moreInfoData, manageOptionsData, supplierPreferenceData);


//     fs.writeFileSync('weeronline_webscraping.json', JSON.stringify(scrapedTitle, null, 2));


//     await browser.close();
// }

// scrapeAndTranslate();

const fs = require('fs');
const puppeteer = require('puppeteer');
const { moreInformation } = require('./scrapper/moreInformation');
const { manageOptions } = require('./scrapper/manageOptions');

async function scrapeAndTranslate() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.weeronline.nl/');

    const moreInfoData = await moreInformation(page);
    const manageOptionsData = await manageOptions(page);

    const scrapedTitle = await page.evaluate((moreInfoData, manageOptionsData) => {
        const title = document.querySelector('.fc-dialog-headline').innerText;

        const permissionElements = document.querySelectorAll('.fc-stacks.fc-dialog-restricted-content ul li .fc-stack-name');
        const permissions = Array.from(permissionElements, element => element.innerText.trim());

        const additionalInfoElements = document.querySelectorAll('.fc-footer.fc-dialog-restricted-content p');
        const additionalInfo = Array.from(additionalInfoElements, element => element.innerText.trim());

        const moreInfo = moreInfoData; 

        const buttonElements = Array.from(document.querySelectorAll('.fc-footer-buttons .fc-button')).slice(0, 2);
        const buttons = Array.from(buttonElements, element => element.innerText.trim());

        const manageOptionsButton = manageOptionsData; 
        
        return {
            cookieBanner:{
                title: title,
                permissions: permissions,
                additionalInfo: additionalInfo,
                moreInfo: moreInfo,
                buttons: buttons,
                manageOptionsButton: manageOptionsButton,
            }
        };
    }, moreInfoData, manageOptionsData);


    fs.writeFileSync('weeronline_webscraping.json', JSON.stringify(scrapedTitle, null, 2));


    await browser.close();
}

scrapeAndTranslate();
