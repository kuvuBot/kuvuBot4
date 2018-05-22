'use strict';

const Discord = require('discord.js');
const moment = require('moment');
const db = require('../database/db.js');

exports.info = {
    command: 'user',
    help: {
        command: 'użytkownik [użytkownik]',
        description: 'wyświetla informacje o użytkowniku',
        category: 'info'
    },
    aliases: [
        'użytkownik'
    ]
};

exports.function = async (parameters) => {
    const config = parameters.config;
    const message = parameters.message;
    const guildID = parameters.guildID;

    await db.check(guildID);

    const user = (message.mentions.users.first() ? message.mentions.users.first() : message.author);

    const embed = new Discord.RichEmbed();
    embed.setAuthor('Informacje o użytkowniku', message.client.user.displayAvatarURL);
    embed.setColor(config.colors.default);
    embed.setThumbnail(user.displayAvatarURL);
    embed.setDescription(`**Discord tag** \`${user.tag}\`\n**ID** \`${user.id}\`\n**${await db.getTrans(guildID, 'user_reg')}** \`${moment(user.createdAt).format('DD.MM.YYYY, HH:mm')}\``);
    embed.setFooter('kuvuBot v4.1.0');
    embed.setTimestamp();

    await message.channel.send(embed);
};
