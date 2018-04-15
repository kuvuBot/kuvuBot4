'use strict';

const Discord = require('discord.js');
const moment = require('moment');

exports.info = {
    command: 'serwer',
    help: {
        command: 'serwer',
        description: 'zwraca informacje o serwerze',
        category: 'Ogólne'
    },
    aliases: [
        'server'
    ]
};

exports.function = async (parameters) => {
    const config = parameters.config;
    const message = parameters.message;

    const guild = message.guild;

    if(!guild) {
        message.reply('tą komendę można używać jedynie na serwerze!');
    } else {
        const embed = new Discord.RichEmbed();
        embed.setAuthor('Informacje o serwerze', message.client.user.displayAvatarURL);
        embed.setColor(config.colors.default);

        if(guild.iconURL) {
            embed.setThumbnail(guild.iconURL);
        }

        embed.addField('Nazwa', guild.name, true);
        embed.addField('Właściciel', guild.owner.displayName, true);
        embed.addField('Ilość członków', guild.members.size, true);
        embed.addField('Ilość ról', guild.roles.size, true);
        embed.addField('Region', guild.region.toUpperCase(), true);
        embed.addField('Czas stworzenia', moment(guild.createdAt).format('DD.MM.YYYY, HH:mm'), true);
        embed.setFooter('kuvuBot v4.1.0');
        embed.setTimestamp();

        await message.channel.send(embed);
    }
};
