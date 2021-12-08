///////////imports //////////////////////////////////////////////////////////////////////////////

//import filesystem lib
const fs = require('fs');
//import puppeteer
const puppeteer = require('puppeteer-extra');



// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { REPL_MODE_STRICT } = require('repl');
puppeteer.use(StealthPlugin());


///////////browser and page instantiation //////////////////////////////////////////////////////////////////////////////

(async () => {
  //open a browser
  const browser = await puppeteer.launch({headless: false, args: [
    '--incognito',
  ]});
  //creation of variable page which contains 1rst page of the browser
  let page =  (await browser.pages())[0];



///////////cookies management //////////////////////////////////////////////////////////////////////////////

  //get the previous used cookies in the file httpbin-cookie.json
  const cookies = fs.readFileSync('httpbin-cookies.json', 'utf8');
  //parsing of the json
  const deserializedCookies = JSON.parse(cookies);
  //setting the page cookies
  await page.setCookie(...deserializedCookies);


///////////go to website and accept the thing//////////////////////////////////////////////////////////////////////////////

  //obvious
  await page.goto('https://www.oui.sncf/proposition/outward/train?wishId=63fe8d1e-31e9-460d-947f-e5a603c71bb3');
  sleep(1000)
  await page.$eval( '#didomi-notice-agree-button', button => button.click() );
  //select 
// wait for the research to end
///////////filter the trains //////////////////////////////////////////////////////////////////////////////
//document.querySelector('.travel-result_wrapper__3Ctth > .travel-result_linkAndRow__G4OPp > .travel-row_wrapper__2LKxV > .vsd-wmj7ia > .vsd-1kir9vv > .vsd-101gsi7 > .vsd-nzr9qi > .vsd-1ixq4jd')
//await page.$eval( 'travel-result_wrapper__3Ctth > .travel-result_linkAndRow__G4OPp > .travel-row_wrapper__2LKxV > .vsd-wmj7ia > .vsd-1kir9vv > .vsd-101gsi7 > .vsd-nzr9qi > .vsd-1ixq4jd',train => train.click() );
const trouve = await page.evaluate(() => {
  //let trains = [];
  let elements = document.querySelectorAll('.travel-row_wrapper__2LKxV');
  let drapeau = false;
  elements.forEach(el => {
    if (el.querySelector(".oui-price-button").getAttribute("data-price") == '0'){
        el.querySelector(".oui-price-button").click()
        drapeau = true
    }})
    return drapeau
});
console.log(trouve)
sleep(2000)
if (trouve)
    await page.$eval( '.vsd-bl85cy > .oui-button___64135 > .oui-button__content___64135', button => button.click() );
    sleep(5000)
    await page.$eval( '.vsd-15xy478 > .oui-button___64135 > span', button => button.click() );




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

