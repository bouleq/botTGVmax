const { SSL_OP_EPHEMERAL_RSA } = require('constants');
// const puppeteer = require('puppeteer');
const cookies = [{name: 'test', value: 'foo'}, {name: 'test2', value: 'foo'}]; // just as example, use real cookies here;
const fs = require('fs');

const puppeteer = require('puppeteer-extra');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());


(async () => {
  const browser = await puppeteer.launch({headless: false, args: [
    '--incognito',
  ]});
  
  const page =  (await browser.pages())[0];


  const cookies = fs.readFileSync('httpbin-cookies.json', 'utf8');

  const deserializedCookies = JSON.parse(cookies);
  await page.setCookie(...deserializedCookies);
  console.log(page)
  //await page.setCookie(...cookies);
  await page.goto('https://www.oui.sncf');
  await page.$eval( '#didomi-notice-agree-button', form => form.click() );

  await page.$eval( '.oui-text-input__label___64135', form => form.click() );

  await page.keyboard.type('P');
  sleep(500)
  await page.keyboard.type('a');
  sleep(500)
  await page.keyboard.type('r');
  sleep(500)
  await page.keyboard.type('i');
  sleep(500)
  await page.keyboard.type('s');
  sleep(500)
  await page.keyboard.press('Enter');

  await page.$eval( 'label[for="vsb-destination-train-launch"]', form => form.click() );

  await page.keyboard.type('G');
  sleep(500)
  await page.keyboard.type('r');
  sleep(500)
  await page.keyboard.type('e');
  sleep(500)
  await page.keyboard.type('n');
  sleep(500)
  await page.keyboard.type('o');
  sleep(500)
  await page.keyboard.press('Enter');
  const cookies1 = await page.cookies();
  const cookieJson = JSON.stringify(cookies1);

  // And save this data to a JSON file
  fs.writeFileSync('httpbin-cookies.json', cookieJson);

  await page.$eval( '.oui-button__content___64135', form => form.click() );
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

