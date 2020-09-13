const puppeteer = require('puppeteer');
const generateTextContent = require('./generateTextContent');

/**
 * @arg {string} word word for spelling and pronunciation check
 * @returns {Promise} resolves string (query results)
 */
const checkOrtho = async (word = '') => {
  console.log(`Ищем '${word}'`);
  const startTime = Date.now();

  let queryResult;
  let isReceived = false;

  if (!word) {
    return {
      queryResult: 'пустой запрос',
      isReceived
    };
  }

  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: true
  });
  const page = await browser.newPage();
  const pageURL = `http://gramota.ru/slovari/dic/?word=${word}`;

  try {
    await page.goto(pageURL);

    const textContent = await page.evaluate(() => {
      const header = document.querySelector('h2');
      if (header) {
        return header.nextElementSibling.textContent;
      }
      return false;
    });

    if (!textContent) {
      return {
        queryResult: 'извините, слово не найдено',
        isReceived
      };
    } else if (textContent === 'Похожие слова:') {
      isReceived = true;

      const proposalText = await page.evaluate(() => {
        const parentDiv = document.querySelector('.inside.block-content');
        const ps = parentDiv.querySelectorAll('p');
        return ps[ps.length - 1].innerHTML;
      });
      queryResult = `искомое слово отсутствует; похожие слова: ${proposalText}`;
    } else {
      isReceived = true;
      const answerText = await page.evaluate(() => document.querySelector('h2').nextElementSibling.innerHTML);
      queryResult = answerText;
    }
  } catch (error) {
    //console.log(`Can't open page ${pageURL}, got following error: ${error}`);
    console.log(error);
  }

  await browser.close();
  const endTime = Date.now();
  if (endTime - startTime > 3000) {
    queryResult += ',<br> простите за ожидание.'
  }
  return {
    queryResult,
    isReceived
  };
};

//module.exports = checkOrtho;

checkOrtho('корован').then(results => { //переместить это в main??
  //console.log(results);
  // if (!results) {
  //   return;
  // }
  const {
    queryResult,
    isReceived
  } = results;
  //console.log(targetElement);
  generateTextContent(queryResult, isReceived);
  process.exit();
}).catch(error => console.log(error))