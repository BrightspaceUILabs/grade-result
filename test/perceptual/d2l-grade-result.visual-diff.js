/* eslint-disable prefer-arrow-callback */
const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');
const testDiff = require('./utils.js');

describe('d2l-labs-d2l-grade-result', () => {

	const visualDiff = new VisualDiff('d2l-grade-result', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/test/perceptual/d2l-grade-result.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
		await visualDiff.disableAnimations(page);
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(() => browser.close());

	it('d2l-labs-d2l-grade-result', async function() {
		await testDiff(visualDiff, page, '#d2l-labs-d2l-grade-result', this.test.fullTitle());
	});

});
