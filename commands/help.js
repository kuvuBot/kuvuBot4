'use strict';

const Discord = require('discord.js');

exports.info = {
    command: '.pomoc',
    help: false,
    aliases: [
        '.help'
    ]
};

exports.function = async (parameters) => {
    const commands = parameters.commands;
    const config = parameters.config;
    const message = parameters.message;

    const categories = [];

    for(const command of commands.filter(command => command.info.help)) {
        if(!categories.find(category => category.name === command.info.help.category)) {
            categories.push({
                name: command.info.help.category,
                commands: []
            });
        }

        const category = categories.find(category => category.name === command.info.help.category);
        category.commands.push(command);
    }

    const categoriesText = [];

    for(const category of categories.sort((a, b) => a.name.localeCompare(b.name))) {
        const commandsText = [];

        for(const command of category.commands.sort((a, b) => a.info.command.localeCompare(b.info.command))) {
            commandsText.push(`\`${command.info.help.command}\` - ${command.info.help.description}`);
        }

        categoriesText.push(`**${category.name}**\n${commandsText.join('\n')}`);
    }

    const embed = new Discord.RichEmbed();
    embed.setAuthor('Lista komend', message.client.user.displayAvatarURL);
    embed.setColor(config.colors.default);
    embed.setDescription(categoriesText.join('\n\n'));

    await message.channel.send(embed);
};