// const puppeteer = require('puppeteer');
// const fs = require('fs');

// async function supplierPreference() {

//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto('https://www.weeronline.nl/');
   
//     const data = await page.evaluate(() => {
//         const supplierPreferenceTitle = document.querySelector('.fc-vendor-preferences-dialog .fc-header h1').innerText;
//         const supplierPreferenceSubTitle = document.querySelector('.fc-vendor-preferences-dialog .fc-body p').innerText;

//         const container = document.querySelector('.fc-dialog.fc-vendor-preferences-dialog .fc-preferences-container');
//         const supplierPreferenceList = Array.from(container.querySelectorAll('.fc-preference-container'), (e) => {
//             const pDescription = ".fc-preference-description .fc-iab-vendor-storage-info-container"

//             const title = e.querySelector('.fc-preference-title h2').innerText;
//             const cookieDuration = e.querySelector(`${pDescription} p`);
//             const text = e.querySelector(`${pDescription} .fc-vendor-data-categories p`);
//             const cookieReset = e.querySelector(`${pDescription} p:last-child`);

//             const links = Array.from(e.querySelectorAll('.fc-preference-description > a')).map(a => a.innerText);

//             const consentCheckbox1 = e.querySelector('.fc-consent-preference-container .fc-preference-slider-label')
//             const consentCheckbox2 = e.querySelector('.fc-legitimate-interest-preference-container .fc-preference-slider-label')

//             return {
//                 title: title,
//                 description: {
//                     cookieDuration: cookieDuration ? cookieDuration.innerText : '',
//                     text: text ? text.innerText : '',
//                     cookieReset: cookieReset ? cookieReset.innerText : ''
//                 },
//                 links: links,
//                 consentCheckbox1: consentCheckbox1 ? consentCheckbox1.innerText : '',
//                 consentCheckbox2: consentCheckbox2 ? consentCheckbox2.innerText : '',
//             };
//         });
//         return {
//             supplierPreferenceTitle: supplierPreferenceTitle,
//             supplierPreferenceSubTitle: supplierPreferenceSubTitle,
//             supplierPreferenceList: supplierPreferenceList
//         }
//     });

//     fs.writeFileSync('preferences.json', JSON.stringify(data, null, 2));

//     await browser.close();

// }

// supplierPreference();



async function supplierPreference(page) {

    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();
    // await page.goto('https://www.weeronline.nl/');
   
    const data = await page.evaluate(() => {
        const supplierPreferenceTitle = document.querySelector('.fc-vendor-preferences-dialog .fc-header h1').innerText;
        const supplierPreferenceSubTitle = document.querySelector('.fc-vendor-preferences-dialog .fc-body p').innerText;

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
        return {
            supplierPreferenceTitle: supplierPreferenceTitle,
            supplierPreferenceSubTitle: supplierPreferenceSubTitle,
            supplierPreferenceList: supplierPreferenceList
        }
    });

    return data

}

// supplierPreference();
module.exports = { supplierPreference };


