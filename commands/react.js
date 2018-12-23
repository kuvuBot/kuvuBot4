'use strict';

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
    const lang = parameters.lang;
    const db = parameters.db;
    const version = parameters.packageInfo.version;

    const text = args.slice(1).join(' ');
    const chars = text.toLowerCase().split('');
    const regA = 127462;

    if(!chars[0]) {
        await message.reply(`${await db.get('trans', lang, 'usage')}\`${prefix}${await db.get('trans', lang, 'react_command')}\`!`);
    } else {
        if (text.length > 20) {
            await message.reply(await db.get('trans', lang, 'react_limit'));
        } else {
            for(const char in chars) {
                if(chars[char].charCodeAt() > 96 && chars[char].charCodeAt() < 123) {
                    let emojiCode = regA + chars[char].charCodeAt() - 97;
                    let emoji = String.fromCodePoint(emojiCode);
                    await message.react(emoji);
                }
            }
        }
    }
};
