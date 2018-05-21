'use strict';

const Discord = require('discord.js');
const db = require('../database/db.js');

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

    let guildID;
    if(!message.guild) {
        guildID = '0';
    } else {
        guildID = message.guild.id;
    }
    await db.check(guildID);

    const user = (message.mentions.users.first() ? message.mentions.users.first() : message.author);

    const embed = new Discord.RichEmbed();
    embed.setAuthor(await db.getTrans(guildID, 'avatar'), message.client.user.displayAvatarURL);
    embed.setColor(config.colors.default);
    embed.setImage(user.displayAvatarURL);
    embed.setFooter('kuvuBot v4.1.0');
    embed.setTimestamp();

    await message.channel.send(embed);
};
