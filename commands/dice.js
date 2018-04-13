'use strict';

const Discord = require('discord.js');

exports.info = {
    command: '.kostka',
    help: {
        command: '.kostka [liczba ścian]',
        description: 'rzut kostką'
    },
    parameters: [
        'args',
        'config',
        'message'
    ]
};

exports.function = async (parameters) => {
    const args = parameters.args;
    const config = parameters.config;
    const message = parameters.message;
    let sides = args[1];

    if (!sides || sides == NaN) {
        sides = 6;
    }
    const random = Math.floor(Math.random() * sides) + 1;

    const embed = new Discord.RichEmbed();
    embed.setAuthor('Rzut kostką', message.client.user.displayAvatarURL);
    embed.setColor(config.colors.default);
    embed.addField('Wyrzuciłeś:', random);

    await message.channel.send(embed);
};
