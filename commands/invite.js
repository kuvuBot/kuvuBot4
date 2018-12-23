'use strict';

const Discord = require('discord.js');

exports.info = {
    command: 'inv',
    help: {
        command: 'invite',
        description: 'generates channel invite',
        category: 'gen'
    },
    aliases: [
        'zaproszenie',
        'invite'
    ]
};

exports.function = async (parameters) => {
    const message = parameters.message;
    const lang = parameters.lang;
    const db = parameters.db;

    if(!message.guild) {
        await message.reply(await db.get('trans', lang, 'onlyText'));
    } else {
        let invite = await message.channel.createInvite();
        await message.channel.send(invite.url);
    }
};
