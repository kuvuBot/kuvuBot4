'use strict';

const Discord = require('discord.js');

exports.info = {
    command: 'pomoc',
    help: false,
    aliases: [
        'help'
    ]
};

exports.function = async (parameters) => {
    const commands = parameters.commands;
    const config = parameters.config;
    const message = parameters.message;
    const prefix = parameters.prefix;

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
    const embed = new Discord.RichEmbed();

    for(const category of categories.sort((a, b) => a.name.localeCompare(b.name))) {
        const commandsText = [];

        let commandsInCat = 0;
        for(const command of category.commands.sort((a, b) => a.info.command.localeCompare(b.info.command))) {
            commandsText.push(`\`${prefix}${command.info.help.command}\` - ${command.info.help.description}`);
            commandsInCat++;
        }
        embed.addField(`${category.name} (${commandsInCat})`, `${commandsText.join('\n')}`);
    }

    embed.setAuthor('Lista komend', message.client.user.displayAvatarURL);
    embed.setColor(config.colors.default);
    embed.setFooter('kuvuBot v4.1.0');
    embed.setTimestamp();

    await message.channel.send(embed);
};