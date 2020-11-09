/** 
 * @module ./removeLineBreaks
 */

 /**
  * removes line breakes
  * @param {string} str - html string
  * @returns {string} - html string
  */
const removeLineBreaks = (str) => {
    if (str.indexOf('<br><br>') === str.length - 8) {
        str = str.slice(0, -8); //cut <br><br> that appears at the end of the string
    }
    
    if (str.includes('<br><br>')) { //if str contains more than one word
        str = str.split('<br><br>').join('\n')
    }

    return str;
}

module.exports = removeLineBreaks;