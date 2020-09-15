const jsdom = require('jsdom');
const {
    JSDOM
} = jsdom;
const accents = require('./accents');


/**
 * @arg {Object {string, boolean}} results
 * @returns {Promise} h-readable query result with accent marks
 */
const generateTextContent = async (results) => {
    //console.log(results);
    const {
        queryResult,
        isReceived
    } = results;

    let resultStr = queryResult;
    //console.log(resultStr);

    if (isReceived) {
        const splitter = 'ent">';

        const ar = queryResult.split(splitter);
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
    //console.log(fakeDom.window.document.querySelector('div').textContent);
    return fakeDom.window.document.querySelector('div').textContent;
}

module.exports = generateTextContent;