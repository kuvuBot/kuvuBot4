'use strict';

const Discord = require('discord.js');

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
    const lang = parameters.lang;
    const db = parameters.db;

    const categories = [];

    for(const command of commands.filter(command => command.info.help)) {
        let cat = await db.getTrans(lang, `categ_${command.info.help.category}`);
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
                let cmd = await db.getTrans(lang, `${command.info.command}_command`);
                let desc = await db.getTrans(lang, `${command.info.command}_desc`);

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
        embed.addField(`${category.name} (${commandsInCat})`, `${commandsText.join('\n')}`, true);
    }
    embed.addBlankField();
    embed.addField('Lvl promotion message/Wiadomość o awansie do poziomu', `:flag_pl: Jeśli chcesz przełączyć wyświetlanie wiadomości o awansie, wpisz \`${prefix}showlvl\`.\n` +
        `:flag_gb: If you want to toggle the promotion message, use \`${prefix}showlvl\`.\n\n`);
    embed.addField('Lang/Język', `:flag_pl: Jeśli chcesz zmienić język bota na swoim serwerze, wykonaj komendę \`${prefix}lang pl\` lub \`${prefix}lang en\`.\n` +
        `:flag_gb: If you want to change the bot language on your guild, use \`${prefix}lang pl\` or \`${prefix}lang en\` command.\n\n`);
    embed.setAuthor(await db.getTrans(lang, 'help_title'), message.client.user.displayAvatarURL);
    embed.setColor(config.colors.default);
    embed.setFooter('kuvuBot v4.2.0');
    embed.setTimestamp();

    await message.channel.send(embed);
};