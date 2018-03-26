'use strict';

const Discord = require('discord.js');
const httpAsPromised = require('http-as-promised');

exports.info = {
    command: '.zdelegalizuj',
    help: {
        command: '.zdelegalizuj [wyraz]',
        description: ' delegalizuje podaną rzecz'
    },
    parameters: [
        'config',
        'args',
        'message'
    ]
};

exports.function = async (parameters) => {
    const config = parameters.config;
    const args = parameters.args;
    const message = parameters.message;

    const word = args[1].toUpperCase();

    if (!word) {
        await message.reply('prawidłowe użycie: `.zdelegalizuj <wyraz>`!');
    } else {
        if (word.length > 10) {
            await message.reply('tekst nie może mieć więcej niż 10 znaków!');
        } else if (!/^[a-z0-9]+$/i.test(word)) {
            await message.reply('tekst zawiera niedozwolone znaki!');
        } else {
            await httpAsPromised.post('https://is-now-illegal.firebaseio.com/queue/tasks.json', {
                json: true,
                body: {task: 'gif', word: word}
            });

            const gif = JSON.parse(await httpAsPromised.get(`https://is-now-illegal.firebaseio.com/gifs/${word}.json`, {resolve: 'body'}));

            const embed = new Discord.RichEmbed();
            embed.setAuthor(`${word} jest teraz nielegalny(e/a)!`, message.client.user.displayAvatarURL);
            embed.setColor(config.colors.default);
            embed.setImage(gif.url);
            message.channel.send(embed);
        }
    }
};
