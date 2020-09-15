
const puppeteer = require('puppeteer');
const generateTextContent = require('./generateTextContent');
require('dotenv').config();


/**
 * @arg {string} word word for spelling and pronunciation check
 * @returns {Promise} resolves string (query results)
 */
const checkOrtho = async (word = '') => {
  word = word.trim();
  const regex = /[a-z]|[A-Z]|[0-9]/;

  console.log(`Ищу '${word}'`);
  const startTime = Date.now();

  let queryResult;
  let isReceived = false;

  if (!word || regex.test(word)) {
    return {
      queryResult: 'пустой или некорректный запрос',
      isReceived
    };
  }

  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: true
  });
  const page = await browser.newPage();
  //const GRAMOTA_URL = process.env.GRAMOTA_URL;
  //console.log(GRAMOTA_URL);

  const pageURL = `${process.env.GRAMOTA_URL}${word}`;
  console.log(pageURL);

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
        queryResult: 'извините, слово не найдено',//???
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
    queryResult += '; простите за ожидание.'
  }
  return {
    queryResult,
    isReceived
  };
};

module.exports = checkOrtho;
