///////////imports //////////////////////////////////////////////////////////////////////////////

//import filesystem lib
const fs = require('fs');
//import puppeteer
const puppeteer = require('puppeteer-extra');

var logDatajson = fs.readFileSync('log.json', 'utf8');
var logData = JSON.parse(logDatajson);

//Nathan id = 0
//Elorri id = 1
const ID = 0;

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());


///////////browser and page instantiation //////////////////////////////////////////////////////////////////////////////

async function main() {
  //open a browser
  let trouve = false;
  let browser = await puppeteer.launch({
    headless: logData.HEADLESS, args: [
      '--incognito',
    ]
  });
  //creation of variable page which contains 1rst page of the browser
  let page = (await browser.pages())[0]
  ///////////cookies management /////////////////////////////////////////////////////////////////////////////
  //get the previous used cookies in the file httpbin-cookie.json
  const cookies = fs.readFileSync('httpbin-cookies.json', 'utf8');
  //parsing of the json
  const deserializedCookies = JSON.parse(cookies);
  //setting the page cookies
  await page.setCookie(...deserializedCookies);

  while (!trouve) {
    try {
      ///////////go to website and accept the thing//////////////////////////////////////////////////////////////////////////////

      //obvious
      await page.goto('https://www.oui.sncf');
      //select 
      await page.$eval('#didomi-notice-agree-button', button => button.click());

      ///////////fill the 'Départ' field//////////////////////////////////////////////////////////////////////////////

      //click on the 'Départ' field
      await page.$eval('.oui-text-input__label___64135', label => label.click());
      //insert the departure city
      await page.keyboard.type(logData['person'][ID].DEPARTURE_CITY);
      sleep(1500)
      //select the first suggested city
      await page.keyboard.press('Enter');

      ///////////fill the 'Arrivée' field //////////////////////////////////////////////////////////////////////////////

      //click on the 'Arrivée' field
      await page.$eval('label[for="vsb-destination-train-launch"]', label => label.click());
      //insert the destination city
      await page.keyboard.type(logData['person'][ID].DESTINATION_CITY);
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
      const Date = logData['person'][ID].DATE
      await page.keyboard.type(Date)
      //select the hours
      // await page.$eval("#schedule-select-startDate", select => select.value = 10);
      await page.keyboard.press("Tab");
      await page.keyboard.press('Enter');
      for(let i = 0; i < (logData['person'][ID].HOUR - 6) /2; i++){
        await page.keyboard.press('ArrowDown');
      }

      await page.keyboard.press('Enter');
      //press 'appliquer' button
      await page.$eval('span[class="oui-button__content___64135"]', button => button.click());
      if(logData.COMMENTS){
        console.log('trajet + date ok')
      }
      /////////add 'MAX jeune' subscription //////////////////////////////////////////////////////////////////////////////

      //click on "modifier le profil"

      await page.$eval('label[for="vsb-destination-train-launch"]', label => label.click());
      for (let i = 0; i < 11; i++) {
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
      //check the 'MAX jeune' box
      await page.$eval('label[for="vsb-train-launch-card-HAPPY_CARD"]', label => label.click());
      //fill with the TGV max number
      await page.keyboard.press("Tab");
      await page.keyboard.type(logData['person'][ID].TGV_MAX_CARD_NUMBER);
      //fill the birthdate
      await page.keyboard.press("Tab");
      await page.keyboard.type(logData['person'][ID].BIRTH_DATE);
      //click on 'Appliquer' button (twice)
      if(logData.PETIT_ECRAN){
        await page.$eval('button[id="vsb-passenger-options-modal-button-confirm"] > span', button => button.click());
        await page.$eval('button[id="vsb-passenger-options-modal-button-confirm"] > span', button => button.click());
      }
      else{
        await page.$eval('#vsb-passenger-options-side-panel-button-confirm > span', button => button.click());
        await page.$eval('#vsb-passenger-options-side-panel-button-confirm > span', button => button.click());
      }
      if(logData.COMMENTS){
        console.log('carte TGV max ok')
      }
      ///////////click on 'rechercher' button //////////////////////////////////////////////////////////////////////////////

      await page.$eval('.oui-button__content___64135', form => form.click());
      // wait for the research to end
      sleep(1000)
      //refresh correctly the page
      await page.reload();
      await page.goto(page.url())
      sleep(5000)
      if(logData.COMMENTS){
        console.log('recherche effectuée')
      }
      ///////////roll out the list of trains //////////////////////////////////////////////////////////////////////////////
      if (logData.TRAIN_ROLL_OUT){
        let next_trains = true
        while(next_trains){
          next_trains = await page.evaluate(() => {
            return (document.querySelector('button[data-auto="LINK_TRAVEL_NEXT_HOUR"]') != null);
        })
          if(next_trains){
            await page.$eval('button[data-auto="LINK_TRAVEL_NEXT_HOUR"]', link => link.click());
            sleep(5000);
          }
        }
        sleep(5000)
        if(logData.COMMENTS){
          console.log('page dépliée')
        }
      }
      else if(logData.ROLL_OUT_NUMBER > 0){
        for (let i = 0; i < logData.ROLL_OUT_NUMBER; i++){
          await page.$eval('button[data-auto="LINK_TRAVEL_NEXT_HOUR"]', link => link.click());
          sleep(5000); 
        }
      }

      ///////////find the first TGV max of the time slot and make the reservation //////////////////////////////////////////////////////////////////////////////
      //find
      trouve = await page.evaluate(() => {
        //let trains = [];
        let elements = document.querySelectorAll('.travel-result_wrapper__3Ctth');
        let drapeau = false;
        elements.forEach(el => {
          if (el.querySelector("span[data-auto='DATA_PRICE_BTN_PRICEBTN_SECOND']") == null){

          }
          else{
            if (el.querySelector("span[data-auto='DATA_PRICE_BTN_PRICEBTN_SECOND']").getAttribute("data-price") == '0') {
              el.querySelector("span[data-auto='DATA_PRICE_BTN_PRICEBTN_SECOND']").click()
              drapeau = true
            }
          }
        })
        return drapeau
      });
      if(logData.COMMENTS){
        console.log(trouve)
      }  
      sleep(1000)
      //make the reservation
      if (trouve) {
        trouve = false
        await page.$eval('.vsd-bl85cy > .oui-button___64135 > .oui-button__content___64135', button => button.click());
        sleep(2000)
        await page.$eval('.vsd-15xy478 > .oui-button___64135 > span', button => button.click());
        sleep(2000)
        await page.reload();
        await page.goto(page.url())
        sleep(5000)
        await page.$eval('.cart-app-7ybu8m > .oui-button___64137 > span', button => button.click());
        sleep(2000)
        await page.$eval("button[data-rfrrlink='basketNew_continuer'] > .oui-button__content___64137", button => button.click());
        sleep(2000)
        await page.reload();
        await page.goto(page.url())
        sleep(5000)
        await page.$eval("label[for='uic-id-6val-radio-group-MISTER']", button => button.click());
        sleep(2000)
        await page.$eval('.vsf-form__button > .oui-button___64136 > span', button => button.click());
        sleep(10000)
        trouve = true
        if(logData.COMMENTS){
          console.log('réservation effectuée')
        } 
      }
    }
    catch (e) {
      console.log(e)
      trouve = "ban"
    }
   
    ///////////save new cookies //////////////////////////////////////////////////////////////////////////////
    //save the new cookies
    const cookies1 = await page.cookies();
    const cookieJson = JSON.stringify(cookies1);
    // And save this data to a JSON file
    fs.writeFileSync('httpbin-cookies.json', cookieJson);
    await browser.close();
    sleep(logData.SLEEP_DURATION_FALSE)
    if (trouve == "ban"){
      sleep(logData.SLEEP_DURATION_BAN)
      trouve = false
    }
    if (!trouve){
      browser = await puppeteer.launch({
        headless: false, args: [
          '--incognito',
        ]
      });
      //creation of variable page which contains 1rst page of the browser
      page = (await browser.pages())[0]
      ///////////cookies management /////////////////////////////////////////////////////////////////////////////
      //get the previous used cookies in the file httpbin-cookie.json
      const cookies = fs.readFileSync('httpbin-cookies.json', 'utf8');
      //parsing of the json
      const deserializedCookies = JSON.parse(cookies);
      //setting the page cookies
      await page.setCookie(...deserializedCookies);
    }
  };
};


function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  let alea = (logData.VARIATION_b - logData.VARIATION_a)*Math.random() + logData.VARIATION_a
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds*alea);
}


main()