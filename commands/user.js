'use strict';

const Discord = require('discord.js');
const moment = require('moment');

exports.info = {
    command: 'user',
    help: {
        command: 'użytkownik [użytkownik]',
        description: 'wyświetla informacje o użytkowniku',
        category: 'info'
    },
    aliases: [
        'użytkownik',
        'uzytkownik'
    ]
};

exports.function = async (parameters) => {
    const config = parameters.config;
    const message = parameters.message;
    const lang = parameters.lang;
    const db = parameters.db;
    const guildID = parameters.guildID;
    const version = parameters.packageInfo.version;

    const user = (message.mentions.users.first() ? message.mentions.users.first() : message.author);

    if(!message.guild) {
        const embed = new Discord.RichEmbed();
        embed.setAuthor(await db.get('trans', lang, 'user_title'), message.client.user.displayAvatarURL);
        embed.setColor(config.colors.default);
        embed.setThumbnail(user.displayAvatarURL);
        embed.addField('Discord tag:', user.tag, true);
        embed.addField('ID:', user.id, true);
        embed.addField(await db.get('trans', lang, 'user_reg'), moment(user.createdAt).format('DD.MM.YYYY, HH:mm'));
        embed.setFooter(`kuvuBot ${version}`);
        embed.setTimestamp();
        await message.channel.send(embed);
    } else {
        let userInfo = await db.getUser(user.id, guildID);

        if (userInfo) {
            const embed = new Discord.RichEmbed();
            embed.setAuthor(await db.get('trans', lang, 'user_title'), message.client.user.displayAvatarURL);
            embed.setColor(config.colors.default);
            embed.setThumbnail(user.displayAvatarURL);
            embed.addField('Discord tag:', user.tag, true);
            embed.addField('ID:', user.id, true);
            embed.addField(await db.get('trans', lang, 'user_reg'), moment(user.createdAt).format('DD.MM.YYYY, HH:mm'));
            embed.addField('LVL:', userInfo['lvl'], true);
            embed.addField('XP:', userInfo['xp'] + '/' + userInfo['lvlProm'], true);
            embed.setFooter(`kuvuBot ${version}`);
            embed.setTimestamp();
            await message.channel.send(embed);
        } else {
            const embed = new Discord.RichEmbed();
            embed.setAuthor(await db.get('trans', lang, 'user_title'), message.client.user.displayAvatarURL);
            embed.setColor(config.colors.default);
            embed.setThumbnail(user.displayAvatarURL);
            embed.addField('Discord tag:', user.tag, true);
            embed.addField('ID:', user.id, true);
            embed.addField(await db.get('trans', lang, 'user_reg'), moment(user.createdAt).format('DD.MM.YYYY, HH:mm'));
            embed.setFooter(`kuvuBot ${version}`);
            embed.setTimestamp();
            await message.channel.send(embed);
        }
    }
};
