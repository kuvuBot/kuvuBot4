'use strict';

const Discord = require('discord.js');

exports.info = {
    command: 'lang',
    help: {
        command: 'lang <pl/en>',
        description: 'changes the bot language',
        category: 'mod'
    },
    show: false
};

exports.function = async (parameters) => {
    const args = parameters.args;
    const message = parameters.message;
    const prefix = parameters.prefix;
    const guildID = parameters.guildID;
    const lang = parameters.lang;
    const db = parameters.db;
    const version = parameters.packageInfo.version;

    const langC = args[1];

    if(!message.guild) {
        await message.reply(await db.getTrans(lang, 'onlyText'));
    } else {
        if (!message.member.hasPermission('MANAGE_GUILD')) {
            await message.reply(await db.getTrans(lang, 'perms'));
        } else {
            if (langC == 'pl' || langC == 'en') {
                await db.update('guilds', guildID, 'lang', langC);
                await message.reply('👌');
            } else {
                await message.reply(`${await db.getTrans(lang, 'usage')} \`${prefix}lang <pl/en>\`!`);
            }
        }
    }
};
