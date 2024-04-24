const fs = require('fs');
const { translate } = require('@vitalets/google-translate-api');

// Function to translate text
async function translateText(text) {
    try {
        const translatedText = await translate(text, { to: 'en' });
        return translatedText.text;
    } catch (error) {
        console.error('Error translating content:', error);
        return text; // Return original text in case of error
    }
}

// Function to translate the JSON data
async function translateJSONData(jsonData) {
    try {
        const translatedData = {
            cookieBanner: {
                title: await translateText(jsonData.cookieBanner.title),
                permissions: await Promise.all(jsonData.cookieBanner.permissions.map(translateText)),
                additionalInfo: await Promise.all(jsonData.cookieBanner.additionalInfo.map(translateText)),
                moreInfo: await Promise.all(jsonData.cookieBanner.moreInfo.map(async (item) => ({
                    title: await translateText(item.title),
                    popupMessage: await translateText(item.popupMessage)
                }))),
                buttons: jsonData.cookieBanner.buttons,
                manageOptionsButton: {
                    title: await translateText(jsonData.cookieBanner.manageOptionsButton.title),
                    subTitle: await translateText(jsonData.cookieBanner.manageOptionsButton.subTitle),
                    preferenceList: await Promise.all(jsonData.cookieBanner.manageOptionsButton.preferenceList.map(async (item) => ({
                        title: await translateText(item.title),
                        description: await translateText(item.description),
                        consent: await translateText(item.consent),
                        legitimateInterest: await translateText(item.legitimateInterest)
                    })))
                }
            }
        };
        
        return translatedData;
    } catch (error) {
        console.error('Error translating JSON data:', error);
        return jsonData; // Return original data in case of error
    }
}

// Load the JSON data
const jsonData = require('./weeronline_webscraping.json');

// Translate the JSON data
translateJSONData(jsonData)
    .then((translatedData) => {
        // Save the translated data as a JSON string to a new file
        const outputFilePath = 'translate_weeronline_webscraping.json';
        fs.writeFileSync(outputFilePath, JSON.stringify(translatedData, null, 2));
        console.log(`Translation complete. Translated data saved to ${outputFilePath}`);
    })
    .catch((error) => {
        console.error('Error translating JSON data:', error);
    });
