'use strict';

const Discord = require('discord.js');

exports.info = {
    command: '.kostka',
    help: {
        command: '.kostka [liczba ścian]',
        description: 'rzut kostką'
    },
    aliases: [
        '.dice'
    ]
};

exports.function = async (parameters) => {
    const args = parameters.args;
    const config = parameters.config;
    const message = parameters.message;
    let sides = args[1];

    if (isNaN(sides)) {
        sides = 6;
    } else {
        if (sides < 4) {
            message.reply('minimalna ilość ścian to 4!');
        } else {
            const random = Math.floor(Math.random() * sides) + 1;

            const embed = new Discord.RichEmbed();
            embed.setAuthor('Rzut kostką', message.client.user.displayAvatarURL);
            embed.setColor(config.colors.default);
            embed.addField('Wyrzuciłeś:', random);

            await message.channel.send(embed);
        }
    }
};
