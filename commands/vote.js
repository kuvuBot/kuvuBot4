'use strict';

const Discord = require('discord.js');

exports.info = {
    command: '.glosowanie',
    help: {
        command: '.glosowanie <pytanie>',
        description: 'robi głosowanie',
        category: 'Moderacyjne'
    },
    aliases: [
        '.vote'
    ]
};

exports.function = async (parameters) => {
    const args = parameters.args;
    const message = parameters.message;
    const question = args.slice(1).join(' ');

    if(!question) {
        await message.reply('prawidłowe użycie: `.glosowanie <pytanie>`!');
    } else {
        await message.delete();
        const newMessage = await message.channel.send(question);
        await newMessage.react('👍');
        await newMessage.react('👎');
    }
};
