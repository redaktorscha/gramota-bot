/** 
 * @module ./isValid
 */


 /**
  * validate user query (no latin letters or numbers)
  * @param {string} word - user query
  * @returns {boolean} - validation result
  */
const isValid = (word) => {

    const notAllowedChars = /[a-z]|[A-Z]|[0-9]/; //regex

    return !(!word || notAllowedChars.test(word));
}

module.exports = isValid;