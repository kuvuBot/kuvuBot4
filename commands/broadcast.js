'use strict';

const Discord = require('discord.js');

exports.info = {
    command: 'ogłoszenie',
    help: {
        command: 'ogłoszenie <treść ogłoszenia>',
        description: 'dodaje ogłoszenie',
        category: 'Moderacyjne'
    },
    aliases: [
        'broadcast',
        'bc',
        'ogloszenie',
        'ogl'
    ]
};

exports.function = async (parameters) => {
    const args = parameters.args;
    const config = parameters.config;
    const message = parameters.message;

    const broadcast = args.slice(1).join(' ');

    if(!broadcast) {
        await message.reply('prawidłowe użycie: `.ogłoszenie <treść ogłoszenia>`!');
    } else {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) {
            await message.reply('nie posiadasz wystarczających uprawnień, aby móc użyć tej komendy!');
        } else {
            await message.delete();

            const embed = new Discord.RichEmbed();
            embed.setAuthor('Ogłoszenie', message.client.user.displayAvatarURL);
            embed.setDescription(broadcast);
            embed.setColor(config.colors.default);
            embed.setFooter('kuvuBot v4.1.0');

            await message.channel.send(embed);
        }
    }
};
