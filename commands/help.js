'use strict';

const Discord = require('discord.js');

exports.info = {
    command: '.pomoc',
    help: {
        command: '.pomoc',
        description: 'wyświetla listę komend'
    },
    parameters: [
        'commands',
        'config',
        'message'
    ]
};

exports.function = async (parameters) => {
    const commands = parameters.commands;
    const config = parameters.config;
    const message = parameters.message;

    const commandsDescriptions = [];

    for(const command of commands) {
        commandsDescriptions.push('`' + command.help.command + '` - ' + command.help.description);
    }

    const embed = new Discord.RichEmbed();
    embed.setAuthor('Spis komend', message.client.user.displayAvatarURL);
    embed.setColor(config.colors.default);
    embed.setDescription(commandsDescriptions.join('\n'));

    if(message.guild) {
        message.author.send(embed).then(privateMessage => {
            message.reply('wysłano pomoc poprzez wiadomość prywatną!');
        }).catch(error => {
            message.reply('nie można było wysłać pomocy poprzez wiadomość prywatną!');
        });
    } else {
        message.channel.send(embed);
    }
};
