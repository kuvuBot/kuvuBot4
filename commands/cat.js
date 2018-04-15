'use strict';

const Discord = require('discord.js');
const httpAsPromised = require('http-as-promised');
const xml = require('xml-js');

exports.info = {
    command: 'kot',
    help: {
        command: 'kot',
        description: 'wyświetla losowego kota',
        category: 'Obrazki'
    },
    aliases: [
        'cat'
    ]
};

exports.function = async (parameters) => {
    const config = parameters.config;
    const message = parameters.message;

    const randomCat = xml.xml2js(await httpAsPromised.get('https://thecatapi.com/api/images/get?format=xml&results_per_page=1', {resolve: 'body'}), {compact: true});

    const embed = new Discord.RichEmbed();
    embed.setAuthor('Losowy kot', message.client.user.displayAvatarURL);
    embed.setColor(config.colors.default);
    embed.setImage(randomCat.response.data.images.image.url._text);
    embed.setFooter('kuvuBot v4.1.0');
    embed.setTimestamp();

    await message.channel.send(embed);
};
