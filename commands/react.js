'use strict';

const db = require('../database/db.js');

exports.info = {
    command: 'react',
    help: {
        command: 'reaguj <tekst>',
        description: 'dodaje reakcje do wiadomości',
        category: 'fun'
    },
    aliases: [
        'reaguj'
    ]
};

exports.function = async (parameters) => {
    const args = parameters.args;
    const message = parameters.message;
    const prefix = parameters.prefix;

    let guildID;
    if(!message.guild) {
        guildID = '0';
    } else {
        guildID = message.guild.id;
    }
    await db.check(guildID);

    const chars = args.slice(1).join(' ').toLowerCase().split('');
    const regA = 127462;

    if(!chars[0]) {
        await message.reply(`${await db.getTrans(guildID, 'usage')}\`${prefix}${await db.getTrans(guildID, 'react_command')}\`!`);
    } else {
        for(const char in chars) {
            if(chars[char].charCodeAt() > 96 && chars[char].charCodeAt() < 123) {
                let emojiCode = regA + chars[char].charCodeAt() - 97;
                let emoji = String.fromCodePoint(emojiCode);
                await message.react(emoji);
            }
        }
    }
};
