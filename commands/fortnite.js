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

    const client = new Fortnite(config.fortniteKey);

    const platform = args[1];
    const player = encodeURIComponent(args[2]);

    if(!platform) {
        message.reply('prawidłowe użycie: `.fortnite <pc/xbl/psn> <nick>`!');
    } else if (!player) {
        message.reply('prawidłowe użycie: `.fortnite <pc/xbl/psn> <nick>`!');
    } else {
        await client.getInfo(player, platform).then(data => {
            const embed = new Discord.RichEmbed();
            embed.setAuthor('Status serwera Minecraft', message.client.user.displayAvatarURL);

            embed.setColor(config.colors.default);
            embed.addField('Wygrane', data.lifetimeStats[8].value, true);
            embed.addField('Zabójstwa', data.lifetimeStats[10].value, true);
            embed.addField('K/D', data.lifetimeStats[11].value, true);
            embed.addField('Rozegrane mecze', data.lifetimeStats[7].value + '\n\u200b');
            embed.addField('Solo', 'Statystyki gier solo.');
            embed.addField('Top 10', data.lifetimeStats[0].value, true);
            embed.addField('Top 25', data.lifetimeStats[5].value + '\n\u200b', true);
            embed.addField('Duo', 'Statystyki gier duo.');
            embed.addField('Top 5', data.lifetimeStats[1].value, true);
            embed.addField('Top 12', data.lifetimeStats[4].value + '\n\u200b', true);
            embed.addField('Squad', 'Statystyki gier squad.');
            embed.addField('Top 3', data.lifetimeStats[2].value, true);
            embed.addField('Top 6', data.lifetimeStats[3].value + '\n\u200b', true);

            message.channel.send(embed);
        });
    }
};
