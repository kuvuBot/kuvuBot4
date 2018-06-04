'use strict';

const Discord = require('discord.js');

exports.info = {
    command: 'bot',
    help: {
        command: 'bot',
        description: 'zwraca informacje o bocie',
        category: 'gen'
    }
};

exports.function = async (parameters) => {
    const config = parameters.config;
    const message = parameters.message;
    const packageInfo = parameters.packageInfo;
    const lang = parameters.lang;    
    const db = parameters.db;

    const bot = message.client;

    const embed = new Discord.RichEmbed();
    embed.setAuthor(await db.getTrans(lang, 'bot_title'), bot.user.displayAvatarURL);
    embed.setColor(config.colors.default);
    embed.setThumbnail(bot.user.displayAvatarURL);
    embed.addField(await db.getTrans(lang, 'bot_name'), bot.user.tag, true);
    embed.addField(await db.getTrans(lang, 'bot_version'), `v${packageInfo.version}`, true);
    embed.addField(await db.getTrans(lang, 'bot_servers'), bot.guilds.size, true);
    embed.addField(await db.getTrans(lang, 'bot_channels'), bot.channels.size, true);
    embed.addField('Github', `[${await db.getTrans(lang, 'check')}](https://github.com/kuvuBot/kuvuBot4)`, true);
    embed.addField(await db.getTrans(lang, 'bot_site'), `[${await db.getTrans(lang, 'check')}](https://bot.kuvus.pl/)`, true);

    const guildsNames = [];

    for(const guild of bot.guilds.array()) {
        guildsNames.push(guild.name);
    }

    embed.addField(await db.getTrans(lang, 'bot_srvs'), guildsNames.slice(0, 9).join(', ') + (guildsNames.length > 10 ? `, ${guildsNames.length - 10} ${await db.getTrans(lang, 'bot_other')}` : ''), true);
    embed.setFooter(`kuvuBot v${packageInfo.version}`);
    embed.setTimestamp();

    await message.channel.send(embed);
};
