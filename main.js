const checkOrtho = require('./checkOrtho');
const generateTextContent = require('./generateTextContent');
const writeToFile = require('./writeToFile');


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

main('м');

//module.exports = main;