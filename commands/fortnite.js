'use strict';

const Discord = require('discord.js');
const Client = require('fortnite');

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
    const lang = parameters.lang;
    const db = parameters.db;
    const version = parameters.packageInfo.version;

    const fortnite = new Client(config.fortniteKey);

    const platform = args[1];
    let player = args.slice(2).join(' ');

    if(!platform) {
        await message.reply(`${await db.get('trans', lang, 'usage')}\`${prefix}${await db.get('trans', lang, 'fn_command')}\`!`);
    } else if (!player) {
        await message.reply(`${await db.get('trans', lang, 'usage')}\`${prefix}${await db.get('trans', lang, 'fn_command')}\`!`);
    } else {
        const title = await db.get('trans', lang, 'fn_title');
        const wins = await db.get('trans', lang, 'fn_wins');
        const kills = await db.get('trans', lang, 'fn_kills');
        const played = await db.get('trans', lang, 'fn_played');

        await fortnite.user(player, platform).then(data => {
            let lifetime = data.stats.lifetime;
            lifetime = JSON.stringify(lifetime);
            lifetime = JSON.parse(lifetime);
            const embed = new Discord.RichEmbed();
            embed.setAuthor(title, message.client.user.displayAvatarURL);

            embed.setColor(config.colors.default);
            embed.addField(wins, lifetime[8].Wins, true);
            embed.addField(kills, lifetime[10].Kills, true);
            embed.addField('K/D', lifetime[11]['K/d'], true);
            embed.addField(played, lifetime[7]['Matches Played'], true);
            embed.setFooter(`kuvuBot ${version}`);
            embed.setTimestamp();

            message.channel.send(embed);
        });
    }
};
