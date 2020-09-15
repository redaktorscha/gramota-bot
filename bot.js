require('dotenv').config();
const { Telegraf } = require('telegraf');

const main = require('./main');

const {
    startText,
    helpText
} = require('./botMsg');

const bot = () => {
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const bot = new Telegraf(BOT_TOKEN);

    //bot replies on command /start
    bot.start((ctx) => {
        const userName = ctx.message.from.first_name;
        ctx.reply(`Здравствуйте, ${userName}. ${startText}`)
    });

    //bot replies on command/help
    bot.help((ctx) => ctx.reply(`${helpText}`));

    //bot reacts on sticker
    bot.on('sticker', (ctx) => ctx.reply('🙂'));

    //bot does spell checking
    bot.on('text', async (ctx) => {
        const text = ctx.message.text;
        //console.log(text);
        const results = await main(text);
        console.log(results);
        await ctx.reply(results);
        

        //ctx.reply(answer);
    });

    bot.launch() // запуск бота

}



bot();





