/** 
 * @module ./main
 */

require('dotenv').config();
const {
    Telegraf
} = require('telegraf');
const Extra = require('telegraf/extra');

const generateBotReply = require('./generateBotReply');
const fs = require('fs');
const botMsg = require('./botMsg');

/**
 * main entry point, initializes and launches the bot
 */
const main = () => {
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const bot = new Telegraf(BOT_TOKEN);


    const {        
        helpText,
        smile,
        errors: {
            errorBotText
        }
    } = botMsg;

    //bot replies on command /start
    bot.start((ctx) => { // ctx object holds the Update object from Telegram API
        const userName = ctx.message.from.first_name;
        botMsg.startText = userName;
        ctx.reply(`${botMsg.startText}`)
    });

    //bot replies on command /help 
    bot.help((ctx) => ctx.reply(`${helpText}`, Extra.HTML())); //using html-markup

    //bot reacts on sticker
    bot.on('sticker', (ctx) => ctx.reply(`${smile}`));

    //bot does spell checking
    bot.on('text', async (ctx) => {

        const result = await generateBotReply(ctx.message.text);

        await ctx.reply(result);
    });

    //bot onerror
    bot.catch((err, ctx) => {
        console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
        const date = new Date().toLocaleString();
        fs.appendFileSync('./error-log', `${date}:${error}\n`);
        ctx.reply(`${errorBotText}`);
    })

    bot.launch(); //start bot

}



main();