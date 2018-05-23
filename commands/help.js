'use strict';

const Discord = require('discord.js');
const db = require('../database/db.js');

exports.info = {
    command: 'help',
    help: false,
    aliases: [
        'pomoc'
    ]
};

exports.function = async (parameters) => {
    const commands = parameters.commands;
    const config = parameters.config;
    const message = parameters.message;
    const prefix = parameters.prefix;
    const guildID = parameters.guildID;

    await db.check(guildID);

    const categories = [];

    for(const command of commands.filter(command => command.info.help)) {
        let cat = await db.getTrans(guildID, `categ_${command.info.help.category}`);
        if(!categories.find(category => category.name === cat)) {
            categories.push({
                name: cat,
                commands: []
            });
        }

        const category = categories.find(category => category.name === cat);
        category.commands.push(command);
    }

    const categoriesText = [];
    const embed = new Discord.RichEmbed();

    for(const category of categories.sort((a, b) => a.name.localeCompare(b.name))) {
        const commandsText = [];

        let commandsInCat = 0;
        for(const command of category.commands.sort((a, b) => a.info.command.localeCompare(b.info.command))) {
            if (command.info.show == false) {} else {
                let cmd = await db.getTrans(guildID, `${command.info.command}_command`);
                let desc = await db.getTrans(guildID, `${command.info.command}_desc`);

                if (!cmd) {
                    cmd = command.info.help.command;
                }
                if (!desc) {
                    desc = command.info.help.description;
                }

                commandsText.push(`\`${prefix}${cmd}\` - ${desc}`);
                commandsInCat++;
            }
        }
        embed.addField(`${category.name} (${commandsInCat})`, `${commandsText.join('\n')}`);
    }
    embed.addBlankField();
    embed.addField('Lang/Język', ':flag_pl: Jeśli chcesz zmienić język bota na swoim serwerze, wykonaj komendę `kb!lang pl` lub `kb!lang en`.\n\n' +
        ':flag_gb: If you want to change the bot language on your guild, use `kb!lang pl` or `kb!lang en` command.\n\n' +
        '**(Only Polish (pl) and English (en) are curently available)**');
    embed.setAuthor(await db.getTrans(guildID, 'help_title'), message.client.user.displayAvatarURL);
    embed.setColor(config.colors.default);
    embed.setFooter('kuvuBot v4.2.0');
    embed.setTimestamp();

    await message.channel.send(embed);
};