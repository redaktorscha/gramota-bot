const puppeteer = require('puppeteer');

const ParseDictPage = async (word) => {
  let data;

  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: true
  });
  const page = await browser.newPage();
  const pageURL = `http://gramota.ru/slovari/dic/?word=${word}`;

  try {
    await page.goto(pageURL);
    console.log(`Opening page: ${pageURL}`);

    const queryAnswer = await page.evaluate(() =>
      document.querySelector('h2').nextElementSibling.textContent);

    if (queryAnswer === 'Похожие слова:') {

      const proposalText = await page.evaluate(() => {
        const parentDiv = document.querySelector('.inside.block-content');
        const ps = parentDiv.querySelectorAll('p');
        return ps[ps.length - 1].textContent;
      });
      data = `Искомое слово отсутствует. Похожие слова: ${proposalText}`;


    } else {
      data = queryAnswer;
    }
    console.log(data);
    //const targetDiv = await page.$$eval()
    //document.querySelector('h2').nextElementSibling

    //console.log(targetDiv.innerText);    
  } catch (error) {
    console.log(`Can't open page ${pageURL}, got following error: ${error}`);
  }

  await browser.close();

  process.exit();
};


ParseDictPage('дом книги');

//module.exports = ParseDictPage;