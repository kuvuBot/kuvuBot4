'use strict';

const cleverbot = require("cleverbot.io");

exports.info = {
    command: 'cb',
    help: {
        command: 'zapytaj <pytanie>',
        description: 'zadaje pytanie cleverbotowi',
        category: 'fun'
    },
    aliases: [
        'ask',
        'zapytaj'
    ]
};

exports.function = async (parameters) => {
    const args = parameters.args;
    const config = parameters.config;
    const message = parameters.message;
    const prefix = parameters.prefix;
    const lang = parameters.lang;
    const db = parameters.db;
    const version = parameters.packageInfo.version;

    const question = args.slice(1).join(' ');

    if(!question) {
        await message.reply(`${await db.getTrans(lang, 'usage')} \`${prefix}${await db.getTrans(lang, 'cb_command')}\`!`);
    } else {
        const bot = new cleverbot(config.cleverbot.user, config.cleverbot.key);
        bot.setNick(message.author.id);
        let session = message.author.id;
        await bot.create(async function (err, session) {
            await bot.ask(question, async function (err, response) {
                await message.reply(response);
            });
        });
    }
};
