/** 
 * @module ./scrapeDictPage
 */
const puppeteer = require('puppeteer');
require('dotenv').config();
const fs = require('fs');
const similarWords = require('./similarWords');
const botMsg = require('./botMsg');


/**
 * @typedef Result
 * @property {string} queryResult - query result (html) or answer text (if not found or incorrect)
 * @property {boolean} isReceived - true if the word was found
 * @property {boolean} wasWaiting - true if searching took more than 3 sec
 * @param {string} word - word for spelling and pronunciation check
 * @returns {Promise<Result>} - resolves query result
 */
const scrapeDictPage = async (word = '') => {

  const {
    searching: {
      notFound,
      foundSimilar
    }
  } = botMsg;

  const startTime = Date.now();

  let queryResult = '';
  let isReceived = false;
  let wasWaiting = false;

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
        queryResult: `${notFound}`,
        isReceived
      };
    } else if (textContent === `${similarWords}`) { // if found something similar but not the word given
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
        queryResult = `${foundSimilar} ${proposalText}`;
      } else {
        queryResult = `${notFound}`;
      }

    } else {
      isReceived = true;
      const answerText = await page.evaluate(() => document.querySelector('h2').nextElementSibling.innerHTML);
      queryResult = answerText;
    }
  } catch (error) {

    const date = new Date().toLocaleString();
    fs.appendFileSync('./error-log', `${date}:${error}\n`);
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

module.exports = scrapeDictPage;