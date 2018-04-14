'use strict';

exports.info = {
    command: 'reaguj',
    help: {
        command: 'reaguj <tekst>',
        description: 'dodaje reakcje do wiadomości',
        category: 'Zabawa'
    },
    aliases: [
        'react'
    ]
};

exports.function = async (parameters) => {
    const args = parameters.args;
    const message = parameters.message;

    const chars = args.slice(1).join(' ').toLowerCase().split('');
    const regA = 127462;

    if(!chars[0]) {
        message.reply('prawidłowe użycie: `.reaguj <tekst>`!');
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
