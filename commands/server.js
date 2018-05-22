'use strict';

const Discord = require('discord.js');
const moment = require('moment');
const db = require('../database/db.js');

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
    const guildID = parameters.guildID;

    await db.check(guildID);

    const guild = message.guild;

    if(!guild) {
        await message.reply(await db.getTrans(guildID, 'onlyText'));
    } else {
        const embed = new Discord.RichEmbed();
        embed.setAuthor(await db.getTrans(guildID, 'srv_title'), message.client.user.displayAvatarURL);
        embed.setColor(config.colors.default);

        if(guild.iconURL) {
            embed.setThumbnail(guild.iconURL);
        }

        embed.addField(await db.getTrans(guildID, 'srv_name'), guild.name, true);
        embed.addField(await db.getTrans(guildID, 'srv_owner'), guild.owner.displayName, true);
        embed.addField(await db.getTrans(guildID, 'srv_members'), guild.members.size, true);
        embed.addField(await db.getTrans(guildID, 'srv_roles'), guild.roles.size, true);
        embed.addField(await db.getTrans(guildID, 'srv_region'), guild.region.toUpperCase(), true);
        embed.addField(await db.getTrans(guildID, 'srv_created'), moment(guild.createdAt).format('DD.MM.YYYY, HH:mm'), true);
        embed.setFooter('kuvuBot v4.1.0');
        embed.setTimestamp();

        await message.channel.send(embed);
    }
};
