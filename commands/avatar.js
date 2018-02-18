'use strict';

const Discord = require('discord.js');

exports.info = {
    command: '.awatar',
    help: {
        command: '.awatar [wzmianka]',
        description: 'zwraca awatar użytkownika'
    },
    parameters: [
        'config',
        'message'
    ]
};

exports.function = async (parameters) => {
    const config = parameters.config;
    const message = parameters.message;

    const user = (message.mentions.users.first() ? message.mentions.users.first() : message.author);

    const embed = new Discord.RichEmbed();
    embed.setAuthor('Awatar użytkownika', message.client.user.displayAvatarURL);
    embed.setColor(config.colors.default);
    embed.setImage(user.displayAvatarURL);

    message.channel.send(embed);
};
