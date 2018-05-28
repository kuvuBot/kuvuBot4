'use strict';

exports.info = {
    command: 'etxt',
    help: {
        command: 'emtekst <tekst>',
        description: 'generuje tekst z emoji',
        category: 'fun'
    },
    aliases: [
        'emtekst',
        'emtext'
    ]
};

exports.function = async (parameters) => {
    const args = parameters.args;
    const message = parameters.message;
    const prefix = parameters.prefix;
    const guildID = parameters.guildID;
    const db = parameters.db;

    const chars = args.slice(1).join(' ').toLowerCase().split('');

    if(!chars[0]) {
        await message.reply(`${await db.getTrans(guildID, 'usage')} \`${prefix}${await db.getTrans(guildID, 'etxt_command')}\`!`);
    } else {
        for(const char in chars) {
            if(chars[char].charCodeAt() > 96 && chars[char].charCodeAt() < 123) {
                chars[char] = `:regional_indicator_${chars[char]}:`;
            } else if(chars[char] === ' ') {
                chars[char] = '   ';
            } else {
                chars[char] = chars[char].toUpperCase();
            }
        }

        await message.reply(chars.join(''));
    }
};
