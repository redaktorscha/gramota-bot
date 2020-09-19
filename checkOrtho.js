const puppeteer = require('puppeteer');
require('dotenv').config();
const writeToFile = require('./writeToFile');



/**
 * @arg {string} word word for spelling and pronunciation check
 * @returns {Promise} resolves query results(html)
 */
const checkOrtho = async (word = '') => {

  const regex = /[a-z]|[A-Z]|[0-9]/;

  const startTime = Date.now();

  let queryResult;
  let isReceived = false;
  let wasWaiting = false;

  if (!word || regex.test(word)) {
    return {
      queryResult: 'некорректный запрос',
      isReceived
    };
  }

  const browser = await puppeteer.launch({ // web-scraping via puppeteer lib
    args: ['--no-sandbox'],
    headless: true
  });
  const page = await browser.newPage();


  const pageURL = `${process.env.GRAMOTA_URL}${word}`;


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
    } else if (textContent === 'Похожие слова:') { // if found something similar but not the word given
      const proposalText = await page.evaluate(() => {
        const parentDiv = document.querySelector('.inside.block-content');
        const ps = parentDiv.querySelectorAll('p');
        if (!ps[ps.length - 1].textContent) {
          return '';
        };
        return ps[ps.length - 1].innerHTML;
      });

      if (proposalText) {
        isReceived = true;
        queryResult = `искомое слово отсутствует; похожие слова: ${proposalText}`;
      } else {
        queryResult = 'извините, слово не найдено';
      }

    } else {
      isReceived = true;
      const answerText = await page.evaluate(() => document.querySelector('h2').nextElementSibling.innerHTML);
      queryResult = answerText;
    }
  } catch (error) {

    const date = new Date().toLocaleString();
    writeToFile('./error-log', `${date}:${error}\n`);
  }

  await browser.close();
  const endTime = Date.now();

  if (endTime - startTime > 3000) {
    wasWaiting = true;
  }

  return {
    queryResult,
    isReceived,
    wasWaiting
  };
};

module.exports = checkOrtho;