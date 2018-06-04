'use strict';

const Discord = require('discord.js');

exports.info = {
    command: 'vote',
    help: {
        command: 'glosowanie <pytanie>',
        description: 'robi głosowanie',
        category: 'mod'
    },
    aliases: [
        'głosowanie',
        'glosowanie'
    ]
};

exports.function = async (parameters) => {
    const args = parameters.args;
    const message = parameters.message;
    const question = args.slice(1).join(' ');
    const prefix = parameters.prefix;
    const lang = parameters.lang;
    const db = parameters.db;

    if(!question) {
        await message.reply(`${await db.getTrans(lang, 'usage')}\`${prefix}${await db.getTrans(lang, 'vote_command')}\`!`);
    } else {
        await message.delete();
        const newMessage = await message.channel.send(question);
        await newMessage.react('👍');
        await newMessage.react('👎');
    }
};
