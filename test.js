///////////imports //////////////////////////////////////////////////////////////////////////////

//import filesystem lib
const fs = require('fs');
//import puppeteer
const puppeteer = require('puppeteer-extra');



// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { REPL_MODE_STRICT } = require('repl');
puppeteer.use(StealthPlugin())



function randi(a, b){
 
    return (b-a)*Math.random() + a
}

function random_sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    let alea = (1.2 - 0.8)*Math.random() + 0.8
    console.log(alea)
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds*alea);
    console.log(milliseconds*alea)
  }

  function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

random_sleep(5000)
sleep(5000)


  