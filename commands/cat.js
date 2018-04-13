'use strict';

const Discord = require('discord.js');
const httpAsPromised = require('http-as-promised');

exports.info = {
    command: '.kot',
    help: {
        command: '.kot',
        description: 'wyświetla losowego kota'
    },
    parameters: [
        'config',
        'message'
    ]
};

exports.function = async (parameters) => {
    const config = parameters.config;
    const message = parameters.message;

    const randomCat = JSON.parse(await httpAsPromised.get('http://aws.random.cat/meow', { resolve: 'body' }));

    const embed = new Discord.RichEmbed();
    embed.setAuthor('Losowy kot', message.client.user.displayAvatarURL);
    embed.setColor(config.colors.default);
    embed.setImage(randomCat.file);

    await message.channel.send(embed);
};
