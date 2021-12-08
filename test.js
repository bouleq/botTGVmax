//import filesystem lib
const fs = require('fs');
//import puppeteer
const puppeteer = require('puppeteer-extra');


( async() => {
    const browser = await puppeteer.launch({headless: false, args: [
        '--incognito',
      ]});

    const page = await browser.newPage()[0];

    await page.goto( 'http://www.example.com/sample.php' );

    // Get a list of all elements.
    var styleNumbers = await page.$$( 'span.styleNumber' );

    // Print the style numbers.
    for( let styleNumber of styleNumbers ) {
        try {
            console.log( await ( await styleNumber.getProperty( 'innerText' ) ).jsonValue() );
        }
        catch( e ) {
            console.log( `Could not get the style number:`, e.message );
        }
    }

    await browser.close();
} )();