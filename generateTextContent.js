const jsdom = require('jsdom');
const {
    JSDOM
} = jsdom;
const accents = require('./accents');


/**
 * @arg {Object {string, boolean, boolean}} results
 * @returns {Promise} h-readable query result with accent marks
 */
const generateTextContent = async (results) => {
    //console.log(results);
    const {
        queryResult,
        isReceived,
        wasWaiting
    } = results;

    
    //console.log(queryResult);

    let resultStr = queryResult;
    

    if (isReceived) {

        let str = queryResult;
        if (str.indexOf('<br><br>') === str.length-8) {
            str = str.slice(0, -8); //cut <br><br> that appears at the end of the string
        }
        

        if (str.includes('<br><br>')) { //if str contains more than one word
            str = str.split('<br><br>').join('\n') 
        }

        const splitter = 'ent">'; //letters with accent marks got css class 'accent'

        const ar = str.split(splitter);
        //console.log(ar);

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
    if (wasWaiting) {
        resultStr += '\n Простите за ожидание.';
    }

    const fakeDom = new JSDOM(`<div>${resultStr}</div>`);
    //console.log(fakeDom.window.document.querySelector('div').textContent);
    return fakeDom.window.document.querySelector('div').textContent;
}

module.exports = generateTextContent;