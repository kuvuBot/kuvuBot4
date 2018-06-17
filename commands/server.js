'use strict';

const Discord = require('discord.js');
const moment = require('moment');

exports.info = {
    command: 'srv',
    help: {
        command: 'serwer',
        description: 'zwraca informacje o serwerze',
        category: 'gen'
    },
    aliases: [
        'server',
        'guild',
        'serwer'
    ]
};

exports.function = async (parameters) => {
    const config = parameters.config;
    const message = parameters.message;
    const lang = parameters.lang;
    const db = parameters.db;

    if(!message.guild) {
        await message.reply(await db.getTrans(lang, 'onlyText'));
    } else {
        const embed = new Discord.RichEmbed();
        embed.setAuthor(await db.getTrans(lang, 'srv_title'), message.client.user.displayAvatarURL);
        embed.setColor(config.colors.default);

        if(guild.iconURL) {
            embed.setThumbnail(guild.iconURL);
        }

        embed.addField(await db.getTrans(lang, 'srv_name'), guild.name, true);
        embed.addField(await db.getTrans(lang, 'srv_owner'), guild.owner.displayName, true);
        embed.addField(await db.getTrans(lang, 'srv_members'), guild.members.size, true);
        embed.addField(await db.getTrans(lang, 'srv_roles'), guild.roles.size, true);
        embed.addField(await db.getTrans(lang, 'srv_region'), guild.region.toUpperCase(), true);
        embed.addField(await db.getTrans(lang, 'srv_created'), moment(guild.createdAt).format('DD.MM.YYYY, HH:mm'), true);
        embed.setFooter('kuvuBot v4.2.0');
        embed.setTimestamp();

        await message.channel.send(embed);
    }
};
