///////////imports //////////////////////////////////////////////////////////////////////////////

//import filesystem lib
const fs = require('fs');
//import puppeteer
const puppeteer = require('puppeteer-extra');



// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());


///////////browser and page instantiation //////////////////////////////////////////////////////////////////////////////

(async () => {
  //open a browser
  const browser = await puppeteer.launch({headless: false, args: [
    '--incognito',
  ]});
  //creation of variable page which contains 1rst page of the browser
  const page =  (await browser.pages())[0];


///////////cookies management //////////////////////////////////////////////////////////////////////////////

  //get the previous used cookies in the file httpbin-cookie.json
  const cookies = fs.readFileSync('httpbin-cookies.json', 'utf8');
  //parsing of the json
  const deserializedCookies = JSON.parse(cookies);
  //setting the page cookies
  await page.setCookie(...deserializedCookies);


///////////go to website and accept the thing//////////////////////////////////////////////////////////////////////////////

  //obvious
  await page.goto('https://www.oui.sncf');
  //select 
  await page.$eval( '#didomi-notice-agree-button', button => button.click() );

///////////fill the 'Départ' field//////////////////////////////////////////////////////////////////////////////

  //click on the 'Départ' field
  await page.$eval( '.oui-text-input__label___64135', label => label.click() );
  //insert the departure city
  await page.keyboard.type('Paris');
  sleep(1000)
  //select the first suggested city
  await page.keyboard.press('Enter');
  
///////////fill the 'Arrivée' field //////////////////////////////////////////////////////////////////////////////

  //click on the 'Arrivée' field
  await page.$eval( 'label[for="vsb-destination-train-launch"]', label => label.click() );
  //insert the destination city
  await page.keyboard.type('Grenoble');
  sleep(1000)
  //select the first suggested city
  await page.keyboard.press('Enter');


///////////fill the 'Date aller' field //////////////////////////////////////////////////////////////////////////////

//date choice
await page.$eval('span[class="vsb-date-time__label"]', button => button.click());
//select the day
await page.$eval('label[for="vsb-datepicker-departure-date-input"]', button => button.click());
const inputValue = await page.$eval('#vsb-datepicker-departure-date-input', el => el.value);
for (let i = 0; i < inputValue.length; i++) {
  await page.keyboard.press('Backspace');
}
const Date = '15/12/2021'
await page.keyboard.type(Date)
//select the hours
// await page.$eval("#schedule-select-startDate", select => select.value = 10);
await page.keyboard.press("Tab");
await page.keyboard.press('Enter');
await page.keyboard.press('ArrowDown');
await page.keyboard.press('Enter');
//press 'appliquer' button
await page.$eval('span[class="oui-button__content___64135"]', button => button.click());

/////////add 'MAX jeune' subscription //////////////////////////////////////////////////////////////////////////////




//click on "modifier le profil"
// await page.$eval('#vsb-button-passenger_1_train-launch', button => button.focus() );
// await page.keyboard.press('Tab');
//methods using tabs
await page.$eval( 'label[for="vsb-destination-train-launch"]', label => label.click() );
for (let i = 0; i < 11; i++){
  await page.keyboard.press("Tab");
  sleep(500)
}
await page.keyboard.press('Enter');
sleep(500)
await page.keyboard.press("Tab");
sleep(500)
await page.keyboard.press('Enter');
sleep(500)
await page.keyboard.press('ArrowDown');
sleep(500)
await page.keyboard.press('ArrowDown');
sleep(500)
await page.keyboard.press('Enter');
sleep(500)
await page.keyboard.press("Tab");
sleep(500)
await page.keyboard.type('23');
sleep(500)
await page.keyboard.press("Tab");
sleep(500)
await page.keyboard.press("Tab");
sleep(500)
await page.keyboard.press('Enter');
sleep(500)
await page.screenshot({ path: 'example.png' });
//check the 'MAX jeune' box
await page.$eval('label[for="vsb-train-launch-card-HAPPY_CARD"]', label => label.click() );
//fill with the TGV max number
await page.keyboard.press("Tab");
await page.keyboard.type('300329812');
//fill the birthdate
await page.keyboard.press("Tab");
await page.keyboard.type('27/02/1998');
//click on 'Appliquer' button (twice)
await page.$eval('#vsb-passenger-options-side-panel-button-confirm > span', button => button.click());
await page.$eval('#vsb-passenger-options-side-panel-button-confirm > span', button => button.click());

// /////////click on 'rechercher' button //////////////////////////////////////////////////////////////////////////////

await page.$eval( '.oui-button__content___64135', form => form.click() );
// wait for the research to end
sleep(10000)

  
//   await page.screenshot({ path: 'example.png' });
  

///////////save new cookies //////////////////////////////////////////////////////////////////////////////
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

