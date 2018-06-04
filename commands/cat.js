'use strict';

const Discord = require('discord.js');
const httpAsPromised = require('http-as-promised');
const xml = require('xml-js');

exports.info = {
    command: 'cat',
    help: {
        command: 'kot',
        description: 'wyświetla losowego kota',
        category: 'img'
    },
    aliases: [
        'kot'
    ]
};

exports.function = async (parameters) => {
    const config = parameters.config;
    const message = parameters.message;
    const lang = parameters.lang;
    const db = parameters.db;

    const randomCat = xml.xml2js(await httpAsPromised.get('https://thecatapi.com/api/images/get?format=xml&results_per_page=1', {resolve: 'body'}), {compact: true});

    const embed = new Discord.RichEmbed();
    embed.setAuthor(await db.getTrans(lang, 'cat_title'), message.client.user.displayAvatarURL);
    embed.setColor(config.colors.default);
    embed.setImage(randomCat.response.data.images.image.url._text);
    embed.setFooter('kuvuBot v4.2.0');
    embed.setTimestamp();

    await message.channel.send(embed);
};
