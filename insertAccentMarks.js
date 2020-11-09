/** 
 * @module ./insertAccentMarks
 */

const accents = require('./accents');

/**
 * inserts accents
 * @param {string} str - html string
 * @returns {string} - string with accent marks
 */
const insertAccentMarks = (str) => {
    const splitter = 'ent">'; //letters with accent marks got css class 'accent'

    const ar = str.split(splitter);

    return ar
        .map(el => {
            if (accents.includes(el[0])) {
                let accentLetter = el[0];
                accentLetter += '&#x301;';

                el = accentLetter + el.slice(1);
            }
            return el;
        }).join(splitter);
}

module.exports = insertAccentMarks;