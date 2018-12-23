'use strict';

exports.info = {
    command: 'showlvl',
    help: {
        command: 'showlvl',
        description: 'toggle lvl promotion message',
        category: 'mod'
    },
    aliases: [
        'showlevel'
    ]
};

exports.function = async (parameters) => {
    const config = parameters.config;
    const message = parameters.message;
    const guildID = parameters.guildID;
    const lang = parameters.lang;
    const db = parameters.db;
    const version = parameters.packageInfo.version;

    if(!message.guild) {
        await message.reply(await db.get('trans', lang, 'onlyText'));
    } else {
        if (!message.member.hasPermission('MANAGE_GUILD')) {
            await message.reply(await db.get('trans', lang, 'perms'));
        } else {
            if (await db.get('lvlToggle', guildID) == 'true') {
                await db.update('guilds', guildID, 'showlvl', 'false');
                await message.reply('👌 - off');
            } else {
                await db.update('guilds', guildID, 'showlvl', 'true');
                await message.reply('👌 - on');
            }
        }
    }
};
