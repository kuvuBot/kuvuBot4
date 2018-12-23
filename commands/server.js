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
    const version = parameters.packageInfo.version;

    if(!message.guild) {
        await message.reply(await db.get('trans', lang, 'onlyText'));
    } else {
        const embed = new Discord.RichEmbed();
        embed.setAuthor(await db.get('trans', lang, 'srv_title'), message.client.user.displayAvatarURL);
        embed.setColor(config.colors.default);

        if(message.guild.iconURL) {
            embed.setThumbnail(message.guild.iconURL);
        }

        embed.addField(await db.get('trans', lang, 'srv_name'), message.guild.name, true);
        embed.addField(await db.get('trans', lang, 'srv_owner'), message.guild.owner.displayName, true);
        embed.addField(await db.get('trans', lang, 'srv_members'), message.guild.members.size, true);
        embed.addField(await db.get('trans', lang, 'srv_roles'), message.guild.roles.size, true);
        embed.addField(await db.get('trans', lang, 'srv_region'), message.guild.region.toUpperCase(), true);
        embed.addField(await db.get('trans', lang, 'srv_created'), moment(message.guild.createdAt).format('DD.MM.YYYY, HH:mm'), true);
        embed.setFooter(`kuvuBot ${version}`);
        embed.setTimestamp();

        await message.channel.send(embed);
    }
};
