'use strict';

const Discord = require('discord.js');

exports.info = {
    command: '.bot',
    help: {
        command: '.bot',
        description: 'zwraca informacje o bocie'
    },
    parameters: [
        'config',
        'message',
        'packageInfo'
    ]
};

exports.function = async (parameters) => {
    const config = parameters.config;
    const message = parameters.message;
    const packageInfo = parameters.packageInfo;

    const bot = message.client;

    const embed = new Discord.RichEmbed();
    embed.setAuthor('Informacje o bocie', bot.user.displayAvatarURL);
    embed.setColor(config.colors.default);
    embed.setThumbnail(bot.user.displayAvatarURL);
    embed.addField('Nazwa', bot.user.tag, true);
    embed.addField('Wersja', `v${packageInfo.version}`, true);
    embed.addField('Ilość serwerów', bot.guilds.size, true);
    embed.addField('Github', '[Przejdź](https://github.com/kuvuBot/kuvuBot4)', true);

    const guildsNames = [];

    for(const guild of bot.guilds.array()) {
        guildsNames.push(guild.name);
    }

    embed.addField('Serwery', guildsNames.slice(0, 9).join(', ') + (guildsNames.length > 10 ? `, ${guildsNames.length - 10} innych` : ''), true);

    await message.channel.send(embed);
};
