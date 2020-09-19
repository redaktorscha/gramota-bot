require('dotenv').config();
const { Telegraf } = require('telegraf');
const Extra = require('telegraf/extra');

const main = require('./main');

const writeToFile = require('./writeToFile');

const {
    startText,
    helpText
} = require('./botMsg');



const bot = () => { 
    const BOT_TOKEN = process.env.BOT_TOKEN; 
    const bot = new Telegraf(BOT_TOKEN);

    //bot replies on command /start
    bot.start((ctx) => {                        // ctx object holds the Update object from Telegram API
        const userName = ctx.message.from.first_name;
        ctx.reply(`Здравствуйте, ${userName}. ${startText}`)
    });

    //bot replies on command /help 
    bot.help((ctx) => ctx.reply(`${helpText}`, Extra.HTML())); //using html-markup

    //bot reacts on sticker
    bot.on('sticker', (ctx) => ctx.reply('🙂'));

    //bot does spell checking
    bot.on('text', async (ctx) => {
       
        const text = ctx.message.text;

        const results = await main(text);
        
        await ctx.reply(results);
    });

    //bot onerror
    bot.catch((err, ctx) => {
        console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
        const date = new Date().toLocaleString();
        writeToFile('./error-log', `${date}:${err}\n`);
        ctx.reply('Кажется, я сломался. Зайдите позже, пожалуйста.');
      })

    bot.launch() //start bot

}



bot();





