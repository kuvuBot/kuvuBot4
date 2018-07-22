'use strict';

const Discord = require('discord.js');

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
    const lang = parameters.lang;
    const db = parameters.db;
    const version = parameters.packageInfo.version;

    let thing = args[1];
    const emojis = {
        rock: `⚪ ${await db.getTrans(lang, 'rps_rock')}`,
        paper: `📰 ${await db.getTrans(lang, 'rps_paper')}`,
        scissors: `✂ ${await db.getTrans(lang, 'rps_scissors')}`,
    };
    const words = [
        `⚪ ${await db.getTrans(lang, 'rps_rock')}`,
        `📰 ${await db.getTrans(lang, 'rps_paper')}`,
        `✂ ${await db.getTrans(lang, 'rps_scissors')}`
    ];

    if (!thing) {
        await message.reply(`${await db.getTrans(lang, 'usage')}\`${prefix}${await db.getTrans(lang, 'rps_command')}\`!`);
    } else {
        thing = thing.toLowerCase();
        if (!thing == "kamien" || !thing == "kamień" || !thing == "nożyce" || !thing == "nozyce" || !thing == "papier" || !thing == await db.getTrans(lang, 'rps_rock') || !thing == await db.getTrans(lang, 'rps_paper') || !thing == await db.getTrans(lang, 'rps_scissors')) {
            await message.reply(`${await db.getTrans(lang, 'usage')}\`${prefix}${await db.getTrans(lang, 'rps_command')}\`!`);
        } else {

            thing = thing
                .replace('kamien', 'rock')
                .replace('nozyce', 'scissors')
                .replace('kamień', 'rock')
                .replace('nożyce', 'scissors')
                .replace('papier', 'paper');
            thing = thing.replace(/rock|paper|scissors/gi, function (matched) {
                matched = matched.replace(/\s/g, '_');
                return emojis[matched];
            });

            const botThing = words[Math.floor(Math.random() * 3)];

            const compare = async function (thing, botThing) {
                if (thing === botThing) {
                    return '🏳 Remis!';
                } else if (thing === emojis['rock']) {
                    if (botThing === emojis['scissors']) {
                        return `🎉 ${await db.getTrans(lang, 'rps_won')}`;
                    }
                } else if (thing === emojis['paper']) {
                    if (botThing === emojis['rock']) {
                        return `🎉 ${await db.getTrans(lang, 'rps_won')}`;
                    }
                } else if (thing === emojis['scissors']) {
                    if (botThing === emojis['rock']) {
                        return `🥊 ${await db.getTrans(lang, 'rps_lost')}`;

                    }
                } else if (thing === emojis['scissors']) {
                    if (botThing === emojis['paper']) {
                        return `🎉 ${await db.getTrans(lang, 'rps_won')}`;

                    }
                } else if (thing === emojis['paper']) {
                    if (botThing === emojis['scissors']) {
                        return `🥊 ${await db.getTrans(lang, 'rps_lost')}`;

                    }
                }
            };
            let result = await compare(thing, botThing);
            if (result == undefined) {
                result = `🥊 ${await db.getTrans(lang, 'rps_lost')}`;
            }
            const embed = new Discord.RichEmbed();
            embed.setAuthor(await db.getTrans(lang, 'rps_title'), message.client.user.displayAvatarURL);
            embed.setColor(config.colors.default);
            embed.addField(await db.getTrans(lang, 'rps_you'), thing, true);
            embed.addField('Bot', botThing, true);
            embed.addField(await db.getTrans(lang, 'rps_result'), result, true);
            embed.setFooter(`kuvuBot ${version}`);
            embed.setTimestamp();

            await message.channel.send(embed);
        }
    }
};
