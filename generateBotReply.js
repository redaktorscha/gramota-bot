/** 
 * @module ./generateBotReply
 */

const scrapeDictPage = require('./scrapeDictPage');
const processQueryResults = require('./processQueryResults');
const isValid = require('./isValid');
const fs = require('fs');
const {
    errors: {
        errorBotText,
        errorGramotaText,
        inCorrect
    }
} = require('./botMsg');

/**
 * compiles bot message depending on query results
 * @param {string} word - word for spelling and pronunciation check from user
 * @returns {Promise<string>} - resolves readable query results or response on error 
 */
const generateBotReply = async (query) => {
    try {
        if (isValid(query.trim())) {
            const results = await scrapeDictPage(query);
            if (results.queryResult) {
                return await processQueryResults(results);
            } else {
                return `${errorGramotaText}`;
            }
        }
        return `${inCorrect}`;


    } catch (error) {
        const date = new Date().toLocaleString();
        fs.appendFileSync('./error-log', `${date}:${error}\n`);
        return `${errorBotText}`;
    }


}

module.exports = generateBotReply;