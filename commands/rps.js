'use strict';

const Discord = require('discord.js');
const db = require('../database/db.js');

exports.info = {
    command: 'rps',
    help: {
        command: 'kpn <kamień/papier/nożyce>',
        description: 'kamień, papier, nożyce z BOTem',
        category: 'fun'
    },
    aliases: [
        'kpn'
    ]
};

exports.function = async (parameters) => {
    const args = parameters.args;
    const config = parameters.config;
    const message = parameters.message;
    const prefix = parameters.prefix;

    let guildID;
    if(!message.guild) {
        guildID = '0';
    } else {
        guildID = message.guild.id;
    }
    await db.check(guildID);

    let thing = args[1];
    const emojis = {
        kamień: `⚪ ${await db.getTrans(guildID, 'rps_rock')}`,
        papier: `📰 ${await db.getTrans(guildID, 'rps_paper')}`,
        nożyce: `✂ ${await db.getTrans(guildID, 'rps_scissors')}`,
    };
    const words = ['⚪ Kamień', '📰 Papier', '✂ Nożyce'];;

    if (!thing) {
        await message.reply(`${await db.getTrans(guildID, 'usage')}\`${prefix}${await db.getTrans(guildID, 'rps_command')}\`!`);
    } else {
        thing = thing.toLowerCase();
        if (!thing == "kamien" || !thing == "kamień" || !thing == "nożyce" || !thing == "nozyce" || !thing == "papier" || !thing == await db.getTrans(guildID, 'rps_rock') || !thing == await db.getTrans(guildID, 'rps_paper') || !thing == await db.getTrans(guildID, 'rps_scissors')) {
            await message.reply(`${await db.getTrans(guildID, 'usage')}\`${prefix}${await db.getTrans(guildID, 'rps_command')}\`!`);
        } else {

            thing = thing
                .replace('kamien', 'kamień')
                .replace('nozyce', 'nożyce');
            thing = thing.replace(/kamień|papier|nożyce/gi, function (matched) {
                matched = matched.replace(/\s/g, '_');
                return emojis[matched];
            });

            const botThing = words[Math.floor(Math.random() * 3)];

            const compare = async function (thing, botThing) {
                if (thing === botThing) {
                    return '🏳 Remis!';
                } else if (thing === emojis['kamień']) {
                    if (botThing === emojis['nożyce']) {
                        return `🎉 ${await db.getTrans(guildID, 'rps_won')}`;
                    }
                } else if (thing === emojis['papier']) {
                    if (botThing === emojis['kamień']) {
                        return `🎉 ${await db.getTrans(guildID, 'rps_won')}`;
                    }
                } else if (thing === emojis['nożyce']) {
                    if (botThing === emojis['kamień']) {
                        return `🥊 ${await db.getTrans(guildID, 'rps_lost')}`;

                    }
                }
            };
            let result = await compare(thing, botThing);
            if (result == undefined) {
                result = `🥊 ${await db.getTrans(guildID, 'rps_lost')}`;
            }
            const embed = new Discord.RichEmbed();
            embed.setAuthor(await db.getTrans(guildID, 'rps_title'), message.client.user.displayAvatarURL);
            embed.setColor(config.colors.default);
            embed.addField(await db.getTrans(guildID, 'rps_you'), thing, true);
            embed.addField('Bot', botThing, true);
            embed.addField(await db.getTrans(guildID, 'rps_result'), result, true);
            embed.setFooter('kuvuBot v4.1.0');
            embed.setTimestamp();

            await message.channel.send(embed);
        }
    }
};
