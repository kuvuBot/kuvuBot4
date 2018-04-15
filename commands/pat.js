'use strict';

const Discord = require('discord.js');
const httpAsPromised = require('http-as-promised');

exports.info = {
    command: 'poklep',
    help: {
        command: 'przytul <osoba>',
        description: 'klepie oznaczonego użytkownika',
        category: 'Obrazki'
    },
    aliases: [
        'pat'
    ]
};

exports.function = async (parameters) => {
    const config = parameters.config;
    const message = parameters.message;
    const args = parameters.args;
    const prefix = parameters.prefix;

    if (!args[1]) {
        message.reply(`prawidłowe użycie: \`${prefix}poklep <osoba>\`.`);
    }
    else {
        const user = (message.mentions.users.first() ? message.mentions.users.first().username : args[1]);
        let image = JSON.parse(await httpAsPromised.get('https://rra.ram.moe/i/r?type=pat', {resolve: 'body'}));
        image = 'https://rra.ram.moe' + image.path;

        const embed = new Discord.RichEmbed();
        embed.setAuthor(`${message.author.username} poklepał ${user}`, message.client.user.displayAvatarURL);
        embed.setColor(config.colors.default);
        embed.setImage(image);
        embed.setFooter('kuvuBot v4.1.0');

        await message.channel.send(embed);
    }
};
