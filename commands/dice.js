'use strict';

const Discord = require('discord.js');
const db = require('../database/db.js');

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
    const guildID = parameters.guildID;

    await db.check(guildID);

    if (args[1] < 4) {
        await message.reply(await db.getTrans(guildID, 'dice_usage'));
    } else {
        const random = Math.floor(Math.random() * 6) + 1;

        const embed = new Discord.RichEmbed();
        embed.setAuthor(await db.getTrans(guildID, 'dice_title'), message.client.user.displayAvatarURL);
        embed.setColor(config.colors.default);
        embed.addField(await db.getTrans(guildID, 'dice_result'), random);
        embed.setFooter('kuvuBot v4.1.0');
        embed.setTimestamp();

        await message.channel.send(embed);
    }
};
