'use strict';

const Discord = require('discord.js');
const Fortnite = require('fortnite');

exports.info = {
    command: 'fortnite',
    help: {
        command: 'fortnite <platforma> <nick>',
        description: 'wyświetla statystyki gracza Fortnite',
        category: 'Zabawa'
    },
    aliases: [
        'fn'
    ]
};

exports.function = async (parameters) => {
    const args = parameters.args;
    const config = parameters.config;
    const message = parameters.message;
    const prefix = parameters.prefix;

    const client = new Fortnite(config.fortniteKey);

    const platform = args[1];
    const player = encodeURIComponent(args[2]);

    if(!platform) {
        message.reply('prawidłowe użycie: `kb!fortnite <pc/xbl/psn> <nick>`!');
    } else if (!player) {
        message.reply('prawidłowe użycie: `kb!fortnite <pc/xbl/psn> <nick>`!');
    } else {
        await client.getInfo(player, platform).then(data => {
            const embed = new Discord.RichEmbed();
            embed.setAuthor('Statystyki Fortnite', message.client.user.displayAvatarURL);

            embed.setColor(config.colors.default);
            embed.addField('Wygrane', data.lifetimeStats[8].value, true);
            embed.addField('Zabójstwa', data.lifetimeStats[10].value, true);
            embed.addField('K/D', data.lifetimeStats[11].value, true);
            embed.addField('Rozegrane mecze', data.lifetimeStats[7].value, true);
            embed.setFooter('kuvuBot v4.1.0');
            embed.setTimestamp();

            message.channel.send(embed);
        });
    }
};
