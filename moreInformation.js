async function moreInformation(page) {
    await page.click('.fc-faq-header.fc-dialog-restricted-content');
    await page.waitForSelector('.fc-faq-contents');

    const moreInfoElements = [];

    for (let index = 0; index <= 3; index++) {
        await page.click(`[data-faq-item-index="${index}"]`);
        await page.waitForSelector('.fc-help-dialog');

        const titleNpopupMessage = await page.evaluate(() => {
            const popupMessage = document.querySelector('.fc-help-dialog .fc-help-dialog-contents div').innerText;
            const title = document.querySelector('.fc-help-dialog h1').innerText;
            return { title: title, popupMessage: popupMessage };
        });

        moreInfoElements.push(titleNpopupMessage);

        await page.click('.fc-help-dialog-close-button');
    }

    return moreInfoElements;
}

module.exports = { moreInformation };
