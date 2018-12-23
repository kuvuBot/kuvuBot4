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
    const version = parameters.packageInfo.version;

    const categories = [];

    for(const command of commands.filter(command => command.info.help)) {
        let cat = await db.get('trans', lang, `categ_${command.info.help.category}`);
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
                let cmd = await db.get('trans', lang, `${command.info.command}_command`);
                let desc = await db.get('trans', lang, `${command.info.command}_desc`);

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
    embed.addField(':flag_gb: Language', `To change the bot language on \nyour guild, use: \`${prefix}lang en\``, true);
    embed.addField(':flag_pl: Język', `Aby zmienić język bota na swoim \nserwerze, użyj \`${prefix}lang pl\``, true);
    embed.addField('Translation/tłumaczenie', '[Help translating kuvuBot\nPomóż tłumaczyć kuvuBota](https://poeditor.com/join/project/No3FgBo5Tx)', true);
    embed.addField('Support', `[${await db.get('trans', lang, 'check')}](https://discord.gg/7jwyFdn)`, true);
    embed.setAuthor(await db.get('trans', lang, 'help_title'), message.client.user.displayAvatarURL);
    embed.setColor(config.colors.default);
    embed.setFooter(`kuvuBot ${version}`);
    embed.setTimestamp();

    await message.channel.send(embed);
};