/* eslint-disable prefer-arrow-callback */
const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');
const testDiff = require('./utils.js');

describe('write enabled visual diff tests', () => {

	const visualDiff = new VisualDiff('d2l-grade-result-write-enabled', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.goto(`${visualDiff.getBaseUrl()}/test/perceptual/d2l-grade-result-write-enabled.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
		await visualDiff.disableAnimations(page);
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(() => browser.close());

	it('write-enabled-number-grade-no-icons', async function() {
		await testDiff(visualDiff, page, '#write-enabled-number-grade-no-icons', this.test.fullTitle());
	});

	it('write-enabled-number-grade-icons', async function() {
		await testDiff(visualDiff, page, '#write-enabled-number-grade-icons', this.test.fullTitle());
	});

	it('write-enabled-number-grade-icons-tooltips-grade', async function() {
		await testDiff(visualDiff, page, '#write-enabled-number-grade-icons-tooltips', this.test.fullTitle(), true);
	});

	it('write-enabled-number-grade-icons-tooltips-reports', async function() {
		await testDiff(visualDiff, page, '#write-enabled-number-grade-icons-tooltips', this.test.fullTitle(), false, true);
	});

	it('write-enabled-letter-grade-no-icons', async function() {
		await testDiff(visualDiff, page, '#write-enabled-letter-grade-no-icons', this.test.fullTitle());
	});

	it('write-enabled-letter-grade-icons', async function() {
		await testDiff(visualDiff, page, '#write-enabled-letter-grade-icons', this.test.fullTitle());
	});

	it('write-enabled-letter-grade-icons-tooltips-grades', async function() {
		await testDiff(visualDiff, page, '#write-enabled-letter-grade-icons-tooltips', this.test.fullTitle(), true);
	});

	it('write-enabled-letter-grade-icons-tooltips-reports', async function() {
		await testDiff(visualDiff, page, '#write-enabled-letter-grade-icons-tooltips', this.test.fullTitle(), false, true);
	});
});
