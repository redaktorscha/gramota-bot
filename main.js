const checkOrtho = require('./checkOrtho');
const generateTextContent = require('./generateTextContent');

const main = async (query) => {
    
        const results = await checkOrtho(query).catch(err => console.log(err));
        const answer = await generateTextContent(results).catch(err => console.log(err));

      
    return answer;
}

module.exports = main;