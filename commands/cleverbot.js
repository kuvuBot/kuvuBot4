'use strict';

const cleverbotAsPromised = require('cleverbot-as-promised');
const db = require('../database/db.js');

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
    const guildID = parameters.guildID;

    await db.check(guildID);

    const question = args.slice(1).join(' ');

    if(!question) {
        await message.reply(`${await db.getTrans(guildID, 'usage')} \`${prefix}${await db.getTrans(guildID, 'cb_command')}\`!`);
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
