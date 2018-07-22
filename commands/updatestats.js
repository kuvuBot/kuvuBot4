'use strict';

const Discord = require('discord.js');

exports.info = {
    command: 'updatestats',
    help: {
        command: 'updatestats',
        description: 'updates the bot stats',
        category: 'mod'
    },
    show: false
};

exports.function = async (parameters) => {
    const config = parameters.config;
    const message = parameters.message;
    const db = parameters.db;
    const version = parameters.packageInfo.version;

    if (!message.author.id === config.owner) {
         await message.reply('Only BOT owner can do this, sorry.');
    } else {
        await db.updateStats(message.client.guilds.size, message.client.channels.size, message.client.users.size);
        await message.reply('👌');
    }
};
