const fs = require('fs');

/** 
 * @arg {string} outputLink - file link (where to store result)
 * @arg {string} resultText - result text
 */
const writeToFile = (outputLink, resultText) => {
    fs.appendFileSync(outputLink, resultText);
}

module.exports = writeToFile;