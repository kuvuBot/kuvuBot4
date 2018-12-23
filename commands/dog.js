'use strict';

const Discord = require('discord.js');
const httpAsPromised = require('http-as-promised');

exports.info = {
    command: 'dog',
    help: {
        command: 'dog',
        description: 'wysyła losowego pieska.',
        category: 'img'
    },
    aliases: [
        'pies',
        'piesek'

    ]
};

exports.function = async (parameters) => {
    const config = parameters.config;
    const message = parameters.message;
    const lang = parameters.lang;
    const db = parameters.db;
    const version = parameters.packageInfo.version;

    const url = 'https://api.thedogapi.com/v1/images/search';
    const dog = JSON.parse(await httpAsPromised.get(url, { resolve : 'body' }));

    const embed = new Discord.RichEmbed();
    embed.setAuthor(await db.get('trans', lang, 'dog_title'), message.client.user.displayAvatarURL);
    embed.setColor(config.colors.default);
    embed.setImage(dog[0].url);
    embed.setFooter(`kuvuBot ${version}`);
    embed.setTimestamp();

    await message.channel.send(embed);
};
