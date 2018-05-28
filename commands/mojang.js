'use strict';

const Discord = require('discord.js');
const httpAsPromised = require('http-as-promised');

exports.info = {
    command: 'mo',
    help: {
        command: 'mojang',
        description: 'zwraca status serwerów Mojang',
        category: 'info'
    },
    aliases: [
        'mojang'
    ]
};

exports.function = async (parameters) => {
    const config = parameters.config;
    const message = parameters.message;
    const guildID = parameters.guildID;
    const db = parameters.db;

    const url = 'https://status.mojang.com/check';
    const mojang = JSON.parse(await httpAsPromised.get(url, { resolve : 'body' }));

    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    function check (item, index) {
        let values = Object.values(mojang[index]);
        let keys = Object.keys(mojang[index]);
        values = values[0].replace('green', '✅ Online');
        values = values.replace('yellow', '⚠');
        values = values.replace('red', '📛 Offline');
        embed.addField(keys[0].capitalize(), values, true);
    }

    const embed = new Discord.RichEmbed();
    embed.setAuthor(await db.getTrans(guildID, 'mo_title'), message.client.user.displayAvatarURL);

    embed.setColor(config.colors.default);
    mojang.forEach(check);
    embed.setFooter('kuvuBot v4.2.0');
    embed.setTimestamp();

    await message.channel.send(embed);
};
