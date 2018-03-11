'use strict';

const Discord = require('discord.js');

exports.info = {
    command: '.kostka',
    help: {
        command: '.kostka',
        description: 'rzut kostką'
    },
    parameters: [
        'config',
        'message'
    ]
};

exports.function = async (parameters) => {
    const config = parameters.config;
    const message = parameters.message;
    const random = Math.floor(Math.random() * 6) + 1;

    const embed = new Discord.RichEmbed();
    embed.setAuthor('Rzut kostką', message.client.user.displayAvatarURL);
    embed.setColor(config.colors.default);
    embed.addField('Wyrzuciłeś:', random);

    message.channel.send(embed);
};
