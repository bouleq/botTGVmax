//import filesystem lib
const fs = require('fs');
//import puppeteer
const puppeteer = require('puppeteer-extra');



// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());




(async () => {
  //open a browser
  const browser = await puppeteer.launch({headless: false, args: [
    '--incognito',
  ]});
  //creation of variable page which contains 1rst page of the browser
  const page =  (await browser.pages())[0];




  //get the previous used cookies in the file httpbin-cookie.json
  const cookies = fs.readFileSync('httpbin-cookies.json', 'utf8');
  //parsing of the json
  const deserializedCookies = JSON.parse(cookies);
  //setting the page cookies
  await page.setCookie(...deserializedCookies);


  //obvious
  await page.goto('https://www.oui.sncf');


  //select 
  await page.$eval( '#didomi-notice-agree-button', button => button.click() );
  //click on the 'Départ field
  await page.$eval( '.oui-text-input__label___64135', label => label.click() );
  //insert the departure city
  await page.keyboard.type('Paris');
  sleep(1000)
  //select the first suggested city
  await page.keyboard.press('Enter');
  
  
  //click on the 'Arrivée' field
  await page.$eval( 'label[for="vsb-destination-train-launch"]', label => label.click() );
  //insert the destination city
  await page.keyboard.type('Grenoble');
  sleep(1000)
  //select the first suggested city
  await page.keyboard.press('Enter');


  //
  await page.$eval( '.oui-button__content___64135', form => form.click() );
  
  
  //await page.screenshot({ path: 'example.png' });
  

  
  //save the new cookies
  const cookies1 = await page.cookies();
  const cookieJson = JSON.stringify(cookies1);
  // And save this data to a JSON file
  fs.writeFileSync('httpbin-cookies.json', cookieJson);

  //await browser.close();

})();




function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
	  currentDate = Date.now();
	} while (currentDate - date < milliseconds);
  }

