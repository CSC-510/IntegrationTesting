const puppeteer = require('puppeteer');
const { expect }  = require('chai');

describe('Duck Duck Go search using basic Puppeteer', function () {

    let browser;
    let page;

    this.timeout(5000000);

    beforeEach(async () => {
        browser = await puppeteer.launch({headless:true});
        page = await browser.newPage();

        // await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1');
        // await page.setViewport({ width: 375, height: 812 });
        await page.goto('https://duckduckgo.com', {waitUntil: 'networkidle0'});
    });

    afterEach(async () => {
        await browser.close();
    });

    it('should have the correct page title', async () => {
        expect(await page.title()).to.eql('DuckDuckGo — Privacy, simplified.');
    });

    it('should show a list of results when searching actual word', async () => {

        await page.waitForSelector('#search_form_input_homepage');

        await page.type('input[id=search_form_input_homepage]', 'puppeteer');
        //await page.click('input[type="submit"]');
        await page.keyboard.press('Enter');

        await page.waitForSelector('h2 a');
        const links = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('h2 a'));
        });
        expect(links.length).to.be.greaterThan(0);

        await browser.close();
    });

    it('should show a warning when searching fake word', async () => {

        browser = await puppeteer.launch({headless:true});
        page = await browser.newPage();
        await page.goto('https://duckduckgo.com', {waitUntil: 'networkidle0'});

        await page.type('input[id=search_form_input_homepage]', 'pupuppeppeteerteer');
        await page.click('input[type="submit"]');
        await page.waitForSelector('div[class=msg__wrap]');
        const text = await page.evaluate(() => {
            return document.querySelector('div[class=msg__wrap]').textContent;
        });
        expect(text).to.contain('Not many results contain');

        await browser.close();
    });

});