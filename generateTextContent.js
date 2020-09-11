const jsdom = require('jsdom');
const {
    JSDOM
} = jsdom;
const accents = require('./accents');


/**
 * @arg {string} str query result (HTML markup)
 * @returns {string} readable query result with accent marks
 */
const generateTextContent = (str) => {

    const splitter = 'ent">';

    const ar = str.split(splitter);
    const resultStr = ar
    .map(el => {
        if (accents.includes(el[0])) {
            let accentLetter = el[0];
            accentLetter += '&#x301;';

            el = accentLetter + el.slice(1);
        }
        return el;
    }).join(splitter);

    // const fakeDom = document.createElement('div');
    // fakeDom.innerHTML = resultStr;
    // console.log(fakeDom.textContent);


    //console.log(resultStr);
    //return resultStr;

    const fakeDom = new JSDOM(`<div>${resultStr}</div>`);
    console.log(fakeDom.window.document.querySelector('div').textContent);
    //return fakeDom.window.document.querySelector('div').textContent;
}

module.exports = generateTextContent;