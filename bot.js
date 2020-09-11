const puppeteer = require('puppeteer');
const generateTextContent = require('./generateTextContent');

/**
 * @arg {string} word word for check spelling and pronunciation
 * @returns {Promise} string (query results)
 */
const checkOrtho = async (word) => {


  let queryResult;
  if (!word) {
    return 'Пустой запрос.';
  }

  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: true
  });
  const page = await browser.newPage();
  const pageURL = `http://gramota.ru/slovari/dic/?word=${word}`;

  try {
    await page.goto(pageURL);
    console.log(`Ищем '${word}'`);




    const textContent = await page.evaluate(() => {
      const header = document.querySelector('h2');
      if (header) {
        return header.nextElementSibling.textContent;
      }
      return false;
    });

    if (!textContent) {
      queryResult = 'Извините, слово не найдено.';
    } else if (textContent === 'Похожие слова:') {

      const proposalText = await page.evaluate(() => {
        const parentDiv = document.querySelector('.inside.block-content');
        const ps = parentDiv.querySelectorAll('p');
        return ps[ps.length - 1].innerHTML;
      });
      queryResult = `Искомое слово отсутствует. Похожие слова: ${proposalText}`;
    } else {
      const answerText = await page.evaluate(() => document.querySelector('h2').nextElementSibling.innerHTML);
      queryResult = answerText;
    }
  } catch (error) {
    //console.log(`Can't open page ${pageURL}, got following error: ${error}`);
    console.log(error);
  }

  await browser.close();
  return queryResult;
};


checkOrtho('впрокат').then(targetElement => {
  //console.log(targetElement);
  generateTextContent(targetElement);
  process.exit();
})

//module.exports = ParseDictPage;