'use strict';

const Discord = require('discord.js');
const httpAsPromised = require('http-as-promised');

exports.info = {
    command: '.mojang',
    help: {
        command: '.mojang',
        description: 'zwraca status serwerów Mojang'
    },
    parameters: [
        'config',
        'message'
    ]
};

exports.function = async (parameters) => {
    const config = parameters.config;
    const message = parameters.message;

    const url = 'https://status.mojang.com/check';
    const mojang = JSON.parse(await httpAsPromised.get(url, { resolve : 'body' }));

    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    function check (item, index) {
        let values = Object.values(mojang[index]);
        let keys = Object.keys(mojang[index]);
        values = values[0].replace('green', '✅ Online');
        values = values.replace('yellow', '⚠ Nieosiągalny');
        values = values.replace('red', '📛 Offline');
        embed.addField(keys[0].capitalize(), values, true);
    }

    const embed = new Discord.RichEmbed();
    embed.setAuthor('Status serwerów Mojang', message.client.user.displayAvatarURL);

    embed.setColor(config.colors.default);
    mojang.forEach(check);

    await message.channel.send(embed);
};
