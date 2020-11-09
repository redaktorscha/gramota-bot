
/** 
 * @module ./processQueryResults
 */
const makeText = require('./makeText');
const removeLineBreaks = require('./removeLineBreaks');
const insertAccentMarks = require('./insertAccentMarks');
const botMsg = require('./botMsg');


/**
 * removes line breakes, inserts accent marks, removes html tags
 * @param {{queryResult: string, isReceived: boolean, wasWaiting: boolean}} results - query results
 * @returns {Promise<string>} - readable query result with accent marks or error text
 */
const processQueryResults = async (results) => {
   
    const {
        queryResult,
        isReceived,
        wasWaiting
    } = results;

    const {errors: {apologize}} = botMsg;


    let resultStr = queryResult;
    

    if (isReceived) {

        if (resultStr.includes('<br><br>')) {
            resultStr = removeLineBreaks(resultStr);
        }
        
        if (resultStr.includes('ent">')) {
            resultStr = insertAccentMarks(resultStr);
        }
    } 
    if (wasWaiting) {
        resultStr += `${apologize}`;
    }

    return makeText(resultStr);    
}

module.exports = processQueryResults;