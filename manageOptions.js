async function manageOptions(page) {
    await page.click('.fc-button.fc-cta-manage-options');
    await page.waitForSelector('.fc-data-preferences-dialog');

    const data = await page.evaluate(() => {
        const manageOptTitle = document.querySelectorAll('.fc-header.fc-dialog-restricted-content h1')[1].innerText;
        const manageOptSubTitle = document.querySelectorAll('.fc-body.fc-dialog-restricted-content p')[0].innerText;

        const preferencesContainer = document.querySelector('.fc-preferences-container');
        const preferenceList = Array.from(preferencesContainer.querySelectorAll('.fc-preference-container'), (e) => {
            const title = e.querySelector('.fc-preference-title h2').innerText;
            const description = e.querySelector('.fc-preference-description .fc-purpose-feature-description').innerText;
            const consent = e.querySelector('.fc-consent-preference-container');
            const legitimateInterest = e.querySelector('.fc-legitimate-interest-preference-container');

            return {
                title: title,
                description: description,
                consent: consent ? consent.innerText : '',
                legitimateInterest: legitimateInterest ? legitimateInterest.innerText : '',
            };
        });

        return {
            title: manageOptTitle,
            subTitle: manageOptSubTitle,
            preferenceList: preferenceList
        };
    });

    return data;
}

module.exports = { manageOptions };
