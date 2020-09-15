require('dotenv').config();
const {
    Telegraf
} = require('telegraf');

//const BOT_NAME = process.env.BOT_NAME;
const BOT_TOKEN = process.env.BOT_TOKEN;


const bot = new Telegraf(BOT_TOKEN);

const {startText, helpText} = require('./botMsg');

// bot reply on command /start
bot.start((ctx) => {
    const userName = ctx.message.from.first_name;
    ctx.reply(`Здравствуйте, ${userName}. ${startText}`)
}); 


// bot reply on command/help
bot.help((ctx) => ctx.reply(`${helpText}`));

//bot echoes text
bot.on('text', (ctx) => {
    const text = ctx.message.text;
    ctx.reply(text);
}); 

bot.launch() // запуск бота