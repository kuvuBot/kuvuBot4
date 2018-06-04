'use strict';

const cleverbotAsPromised = require('cleverbot-as-promised');

const csCache = {};

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

    const question = args.slice(1).join(' ');

    if(!question) {
        await message.reply(`${await db.getTrans(lang, 'usage')} \`${prefix}${await db.getTrans(lang, 'cb_command')}\`!`);
    } else {
        const cleverbotClient = new cleverbotAsPromised(config.cleverbotKey);

        const response = await cleverbotClient.getReply({
            key: config.key,
            input: question,
            cs: csCache[message.author.id]
        });

        csCache[message.author.id] = response.cs;
        await message.reply(response.output);
    }
};
