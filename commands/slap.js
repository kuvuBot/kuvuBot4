'use strict';

const Discord = require('discord.js');
const httpAsPromised = require('http-as-promised');
const db = require('../database/db.js');

exports.info = {
    command: 'slap',
    help: {
        command: 'uderz <osoba>',
        description: 'uderza oznaczonego użytkownika',
        category: 'img'
    },
    aliases: [
        'uderz'
    ]
};

exports.function = async (parameters) => {
    const config = parameters.config;
    const message = parameters.message;
    const args = parameters.args;
    const prefix = parameters.prefix;
    const guildID = parameters.guildID;

    await db.check(guildID);

    if (!args[1]) {
        await message.reply(`${await db.getTrans(guildID, 'usage')}\`${prefix}${await db.getTrans(guildID, 'slap_command')}\`!`);
    }
    else {
        const user = (message.mentions.users.first() ? message.mentions.users.first().username : args[1]);
        let image = JSON.parse(await httpAsPromised.get('https://rra.ram.moe/i/r?type=slap', {resolve: 'body'}));
        image = 'https://rra.ram.moe' + image.path;

        const embed = new Discord.RichEmbed();
        embed.setAuthor(`${message.author.username} ${await db.getTrans(guildID, 'slap_text')} ${user}`, message.client.user.displayAvatarURL);
        embed.setColor(config.colors.default);
        embed.setImage(image);
        embed.setFooter('kuvuBot v4.1.0');
        embed.setTimestamp();

        await message.channel.send(embed);
    }
};
