'use strict';

const Discord = require('discord.js');

exports.info = {
    command: 'avatar',
    help: {
        command: 'awatar [wzmianka]',
        description: 'zwraca awatar użytkownika',
        category: 'gen'
    },
    aliases: [
        'awatar'
    ]
};

exports.function = async (parameters) => {
    const config = parameters.config;
    const message = parameters.message;
    const lang = parameters.lang;
    const db = parameters.db;

    const user = (message.mentions.users.first() ? message.mentions.users.first() : message.author);

    const embed = new Discord.RichEmbed();
    embed.setAuthor(await db.getTrans(lang, 'avatar'), message.client.user.displayAvatarURL);
    embed.setColor(config.colors.default);
    embed.setImage(user.displayAvatarURL);
    embed.setFooter('kuvuBot v4.2.0');
    embed.setTimestamp();

    await message.channel.send(embed);
};
