/* eslint-disable prefer-arrow-callback */
const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');
const testDiff = require('./utils.js');

describe('read only visual diff tests', () => {

	const visualDiff = new VisualDiff('d2l-grade-result-read-only', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/test/perceptual/d2l-grade-result-read-only.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
		await visualDiff.disableAnimations(page);
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(() => browser.close());

	it('read-only-number-grade-no-icons', async function() {
		await testDiff(visualDiff, page, '#read-only-number-grade-no-icons', this.test.fullTitle());
	});

	it('read-only-number-grade-icons', async function() {
		await testDiff(visualDiff, page, '#read-only-number-grade-icons', this.test.fullTitle());
	});

	it('read-only-number-grade-icons-tooltips-grades', async function() {
		await testDiff(visualDiff, page, '#read-only-number-grade-icons-tooltips', this.test.fullTitle(), true);
	});

	it('read-only-number-grade-icons-tooltips-reports', async function() {
		await testDiff(visualDiff, page, '#read-only-number-grade-icons-tooltips', this.test.fullTitle(), false, true);
	});

	it('read-only-letter-grade-no-icons', async function() {
		await testDiff(visualDiff, page, '#read-only-letter-grade-no-icons', this.test.fullTitle());
	});

	it('read-only-letter-grade-icons', async function() {
		await testDiff(visualDiff, page, '#read-only-letter-grade-icons', this.test.fullTitle());
	});

	it('read-only-letter-grade-icons-tooltips-grades', async function() {
		await testDiff(visualDiff, page, '#read-only-letter-grade-icons-tooltips', this.test.fullTitle(), true);
	});

	it('read-only-letter-grade-icons-tooltips-reports', async function() {
		await testDiff(visualDiff, page, '#read-only-letter-grade-icons-tooltips', this.test.fullTitle(), false, true);
	});

});
