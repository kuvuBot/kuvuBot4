'use strict';

const Discord = require('discord.js');
const httpAsPromised = require('http-as-promised');
const db = require('../database/db.js');

exports.info = {
    command: 'mc',
    help: {
        command: 'minecraft <adres ip> [port]',
        description: 'zwraca status podanego serwera',
        category: 'info'
    },
    aliases: [
        'minecraft'
    ]
};

exports.function = async (parameters) => {
    const args = parameters.args;
    const config = parameters.config;
    const message = parameters.message;
    const prefix = parameters.prefix;

    let guildID;
    if(!message.guild) {
        guildID = '0';
    } else {
        guildID = message.guild.id;
    }
    await db.check(guildID);

    const serverIP = args[1];
    const serverPort = (args[2] ? args[2] : 25565);

    if(!serverIP) {
        await message.reply(`${await db.getTrans(guildID, 'usage')}\`${prefix}${await db.getTrans(guildID, 'mc_command')}\`!`);
    } else {
        const url = `https://mcapi.us/server/status?ip=${serverIP}&port=${serverPort}`;
        const server = JSON.parse(await httpAsPromised.get(url, { resolve : 'body' }));

        const embed = new Discord.RichEmbed();
        embed.setAuthor(await db.getTrans(guildID, 'mc_title'), message.client.user.displayAvatarURL);

        if(server.online) {
            embed.setColor('80ba27');
            embed.addField('Status', 'Online', true);
            embed.addField(await db.getTrans(guildID, 'mc_players'), `${server.players.now}/${server.players.max}`, true);
            embed.addField(await db.getTrans(guildID, 'mc_version'), server.server.name, true);
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
