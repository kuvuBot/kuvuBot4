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
    ],
    show: 'false'
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
            if (await db.getlvlToggle(guildID) == 'true') {
                await db.update('guilds', guildID, 'showlvl', 'false');
                await message.reply('👌');
            } else {
                await db.update('guilds', guildID, 'showlvl', 'true');
                await message.reply('👌');
            }
        }
    }
};
