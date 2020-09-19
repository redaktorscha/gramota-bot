const checkOrtho = require('./checkOrtho');
const generateTextContent = require('./generateTextContent');
const writeToFile = require('./writeToFile');

/**
 * @arg {string} word word for spelling and pronunciation check from user
 * @returns {Promise} resolves readable query results (string)
 */
const main = async (query) => {
    let answer;

    try {
        const results = await checkOrtho(query);        
        answer = await generateTextContent(results);
        return answer;

    } catch (error) {
        const date = new Date().toLocaleString();
        writeToFile('./error-log', `${date}:${error}\n`);
    }
    
    return answer;
}



module.exports = main;