const { SSL_OP_EPHEMERAL_RSA } = require('constants');
const puppeteer = require('puppeteer');
const cookies = [{name: 'test', value: 'foo'}, {name: 'test2', value: 'foo'}]; // just as example, use real cookies here;

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  //await page.setCookie(...cookies);
  await page.goto('https://www.oui.sncf/proposition/outward/train?wishId=4a1b0414-9656-42e9-bf3c-9d23fde72fc7');
  await page.screenshot({ path: 'example.png' });

  //await browser.close();
})();


function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
	  currentDate = Date.now();
	} while (currentDate - date < milliseconds);
  }