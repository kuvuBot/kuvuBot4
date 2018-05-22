'use strict';

const Discord = require('discord.js');
const Fortnite = require('fortnite');
const db = require('../database/db.js');

exports.info = {
    command: 'fn',
    help: {
        command: 'fortnite <platforma> <nick>',
        description: 'wyświetla statystyki gracza Fortnite',
        category: 'info'
    },
    aliases: [
        'fortnite'
    ]
};

exports.function = async (parameters) => {
    const args = parameters.args;
    const config = parameters.config;
    const message = parameters.message;
    const prefix = parameters.prefix;
    const guildID = parameters.guildID;

    await db.check(guildID);

    const client = new Fortnite(config.fortniteKey);

    const platform = args[1];
    const player = encodeURIComponent(args[2]);

    if(!platform) {
        await message.reply(`${await db.getTrans(guildID, 'usage')}\`${prefix}${await db.getTrans(guildID, 'fn_command')}\`!`);
    } else if (!player) {
        await message.reply(`${await db.getTrans(guildID, 'usage')}\`${prefix}${await db.getTrans(guildID, 'fn_command')}\`!`);
    } else {
        const title = await db.getTrans(guildID, 'fn_title');
        const wins = await db.getTrans(guildID, 'fn_wins');
        const kills = await db.getTrans(guildID, 'fn_kills');
        const played = await db.getTrans(guildID, 'fn_played');

        await client.getInfo(player, platform).then(data => {
            const embed = new Discord.RichEmbed();
            embed.setAuthor(title, message.client.user.displayAvatarURL);

            embed.setColor(config.colors.default);
            embed.addField(wins, data.lifetimeStats[8].value, true);
            embed.addField(kills, data.lifetimeStats[10].value, true);
            embed.addField('K/D', data.lifetimeStats[11].value, true);
            embed.addField(played, data.lifetimeStats[7].value, true);
            embed.setFooter('kuvuBot v4.1.0');
            embed.setTimestamp();

            message.channel.send(embed);
        });
    }
};
