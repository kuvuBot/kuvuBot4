'use strict';

exports.info = {
    command: '.emtekst',
    help: {
        command: '.emtekst <tekst>',
        description: 'generuje tekst z emoji'
    },
    parameters: [
        'args',
        'message'
    ]
};

exports.function = async (parameters) => {
    const args = parameters.args;
    const message = parameters.message;

    const chars = args.slice(1).join(' ').toLowerCase().split('');

    if(!chars[0]) {
        message.reply('prawidłowe użycie: `.emtekst <tekst>`!');
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

        message.reply(chars.join(''));
    }
};
