const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const accents = require('./accents');


/**
 * @arg {string} str query result (contains HTML markup)
 * @arg {boolean} received 
 */
const generateTextContent = (str, received) => {
    let resultStr = str;
    //console.log(resultStr);

    if (received) {
        const splitter = 'ent">';

        const ar = str.split(splitter);
        console.log(ar);
        resultStr = ar
            .map((el, i, _) => {
                if (i > 0 && accents.includes(el[0])) {
                    let accentLetter = el[0];
                    accentLetter += '&#x301;';
                    //accentLetter += '&#769';

                    el = accentLetter + el.slice(1);
                }
                return el;
            }).join(splitter);
    }


    // const fakeDom = document.createElement('div');
    // fakeDom.innerHTML = resultStr;
    // console.log(fakeDom.textContent);


    //console.log(resultStr);
    //return resultStr;

    const fakeDom = new JSDOM(`<div>${resultStr}</div>`);
    console.log(fakeDom.window.document.querySelector('div').textContent);
    //return fakeDom.window.document.querySelector('div').textContent;  @returns {string} h-readable query result with accent marks
}

module.exports = generateTextContent;