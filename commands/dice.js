'use strict';

const Discord = require('discord.js');

exports.info = {
    command: '.kostka',
    help: {
        command: '.kostka',
        description: 'rzut kostką'
    },
    parameters: [
        'message'
    ]
};

exports.function = async (parameters) => {
    const message = parameters.message;
    const random = Math.floor(Math.random() * 6) + 1;

    const embed = new Discord.RichEmbed();
    embed.setAuthor('Rzut kostką', message.client.user.displayAvatarURL);
    embed.setColor('80ba27');
    embed.addField('Wyrzuciłeś:', random);

    message.channel.send(embed);
};
