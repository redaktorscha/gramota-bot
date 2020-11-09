/** 
 * @module ./makeText
 */

const jsdom = require('jsdom');
const {
    JSDOM
} = jsdom; 

/**
 * makes string without html tags
 * @param {string} str - string for compiling bot response
 * @returns {string} - string without html tags
 */

const makeText = (str) => {
    const fakeDom = new JSDOM(`<div>${str}</div>`);    
    return fakeDom.window.document.querySelector('div').textContent;
}

module.exports = makeText;