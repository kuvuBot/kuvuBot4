'use strict';

const Discord = require('discord.js');
const httpAsPromised = require('http-as-promised');

exports.info = {
    command: 'minecraft',
    help: {
        command: 'minecraft <adres ip> [port]',
        description: 'zwraca status podanego serwera',
        category: 'Informacyjne'
    },
    aliases: [
        'mc'
    ]
};

exports.function = async (parameters) => {
    const args = parameters.args;
    const config = parameters.config;
    const message = parameters.message;
    const prefix = parameters.prefix;

    const serverIP = args[1];
    const serverPort = (args[2] ? args[2] : 25565);

    if(!serverIP) {
        message.reply(`prawidłowe użycie: \`${prefix}minecraft <adres ip> [port]\`!`);
    } else {
        const url = `https://mcapi.us/server/status?ip=${serverIP}&port=${serverPort}`;
        const server = JSON.parse(await httpAsPromised.get(url, { resolve : 'body' }));

        const embed = new Discord.RichEmbed();
        embed.setAuthor('Status serwera Minecraft', message.client.user.displayAvatarURL);

        if(server.online) {
            embed.setColor('80ba27');
            embed.addField('Status', 'Online', true);
            embed.addField('Gracze', `${server.players.now}/${server.players.max}`, true);
            embed.addField('Wersja', server.server.name, true);
            embed.addField('MOTD', '```\n' + server.motd + '\n```');
        } else {
            embed.setColor('ff0000');
            embed.addField('Status', 'Offline');
        }
        embed.setFooter('kuvuBot v4.1.0');
        embed.setTimestamp();

        await message.channel.send(embed);
    }
};
