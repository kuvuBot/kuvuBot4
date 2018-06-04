'use strict';

const Discord = require('discord.js');

exports.info = {
    command: 'prefix',
    help: {
        command: 'prefix <prefix>',
        description: 'changes the bot prefix',
        category: 'mod'
    }
};

exports.function = async (parameters) => {
    const args = parameters.args;
    const message = parameters.message;
    const prefix = parameters.prefix;
    const guildID = parameters.guildID;
    const lang = parameters.lang;
    const db = parameters.db;

    const prefixText = args[1];

    if(!message.guild) {
        await message.reply(await db.getTrans(lang, 'onlyText'));
    } else {
        if (!message.member.hasPermission('MANAGE_GUILD')) {
            await message.reply(await db.getTrans(lang, 'perms'));
        } else {
            if (prefixText) {
                await db.update('guilds', guildID, 'prefix', prefixText);
                await message.reply('👌');
            } else {
                await message.reply(`${await db.getTrans(lang, 'usage')} \`${prefix}prefix <prefix>\`!`);
            }
        }
    }
};
