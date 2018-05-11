'use strict';

const Discord = require('discord.js');

exports.info = {
    command: 'kpn',
    help: {
        command: 'kpn <kamień/papier/nożyce>',
        description: 'kamień, papier, nożyce z BOTem',
        category: 'Zabawa'
    },
    aliases: [
        'rps'
    ]
};

exports.function = async (parameters) => {
    const args = parameters.args;
    const config = parameters.config;
    const message = parameters.message;
    const prefix = parameters.prefix;

    let thing = args[1].toLowerCase();
    const emojis = {
        kamień: '⚪ Kamień',
        papier: '📰 Papier',
        nożyce: '✂ Nożyce',
    };
    const words = ['⚪ Kamień', '📰 Papier', '✂ Nożyce'];;

    if (!args[1].toLowerCase() == "kamien" || !args[1].toLowerCase() == "kamień" || !args[1].toLowerCase() == "nożyce" || !args[1].toLowerCase() == "nozyce" || !args[1].toLowerCase() == "papier") {
        await message.reply(`prawidłowe użycie: \`${prefix}kpn <kamień/papier/nożyce>\`!`);
    } else {
        thing = thing
            .replace('kamien', 'kamień')
            .replace('nozyce', 'nożyce');
        thing = thing.replace(/kamień|papier|nożyce/gi, function(matched) {
            matched = matched.replace(/\s/g, '_');
            return emojis[matched];
        });

        const botThing = words[Math.floor(Math.random() * 3)];

        const compare = function(thing, botThing) {
            if (thing === botThing) {
                return '🏳 Remis!';
            } else if (thing === emojis['kamień']) {
                if (botThing === emojis['nożyce']) {
                    return '🎉 Wygrałeś!';
                }
            } else if (thing === emojis['papier']) {
                if (botThing === emojis['kamień']) {
                    return '🎉 Wygrałeś!';
                }
            } else if (thing === emojis['nożyce']) {
                if (botThing === emojis['kamień']) {
                    return '🥊 Przegrałeś :c';

                }
            }
        };
        let result = compare(thing, botThing);
        if (result == undefined) {
            result = '🥊 Przegrałeś :c';
        }
        const embed = new Discord.RichEmbed();
        embed.setAuthor('Papier, kamień nożyce', message.client.user.displayAvatarURL);
        embed.setColor(config.colors.default);
        embed.addField('Ty', thing, true);
        embed.addField('Bot', botThing, true);
        embed.addField('Wynik', result, true);
        embed.setFooter('kuvuBot v4.1.0');
        embed.setTimestamp();

        await message.channel.send(embed);
     }

};
