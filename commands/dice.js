'use strict';

const Discord = require('discord.js');

exports.info = {
    command: 'dice',
    help: {
        command: 'kostka [liczba ścian]',
        description: 'rzut kostką',
        category: 'fun'
    },
    aliases: [
        'kostka'
    ]
};

exports.function = async (parameters) => {
    let args = parameters.args;
    const config = parameters.config;
    const message = parameters.message;
    const lang = parameters.lang;
    const db = parameters.db;

    if (isNaN(args[1])) {
        const random = Math.floor(Math.random() * 6) + 1;
    
        const embed = new Discord.RichEmbed();
        embed.setAuthor(await db.getTrans(lang, 'dice_title'), message.client.user.displayAvatarURL);
        embed.setColor(config.colors.default);
        embed.addField(await db.getTrans(lang, 'dice_result'), random);
        embed.setFooter('kuvuBot v4.2.0');
        embed.setTimestamp();
    
        await message.channel.send(embed);
    }
    else {
        if (args[1] < 4) {
            await message.reply(await db.getTrans(lang, 'dice_usage'));
        } else {
            const random = Math.floor(Math.random() * args[1]) + 1;
    
            const embed = new Discord.RichEmbed();
            embed.setAuthor(await db.getTrans(lang, 'dice_title'), message.client.user.displayAvatarURL);
            embed.setColor(config.colors.default);
            embed.addField(await db.getTrans(lang, 'dice_result'), random);
            embed.setFooter('kuvuBot v4.2.0');
            embed.setTimestamp();
    
            await message.channel.send(embed);
        }
    }
};
