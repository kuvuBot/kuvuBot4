'use strict';

const fs = require('fs');
const path = require('path');

const Discord = require('discord.js');
const db = require('./inc/db.js');
const errorH = require('./inc/error.js');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')));
const packageInfo = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json')));

const commandsFilenames = fs.readdirSync(path.join(__dirname, 'commands'));
const commands = [];

for(const commandFilename of commandsFilenames) {
    const command = require(path.join(__dirname, 'commands', commandFilename));
    commands.push(command);
}

const client = new Discord.Client();

client.on('ready', () => {
    client.user.setPresence({ game: { name: `kb!help | ${client.guilds.size} guilds`, type: 'LISTENING' }, status: 'online' });
    db.load();
    console.log('Client is ready!');
});

client.on('guildCreate', async () => {
    await db.updateStats(client.guilds.size, client.channels.size, client.users.size);
});

client.on('message', async message => {
    if(message.author.bot) return;

    let guildID;
    if(!message.guild) {
        guildID = '0';
    } else {
        guildID = message.guild.id;
    }
    await db.check(guildID);

    const prefix = await db.getPrefix(guildID);

    const args = message.content.toLowerCase().trim().split(/\s+/);
    const command = commands.find(command => prefix + command.info.command === args[0] || (command.info.aliases ? command.info.aliases.find(alias => prefix + alias === args[0]) : false));

    if(command) {
        await message.channel.startTyping();
        const lang = await db.getLang(guildID);

        const parameters = {
            args,
            commands,
            config,
            message,
            packageInfo,
            prefix,
            guildID,
            lang,
            client,
            db
        };

        await command.function(parameters).then(() => {
            message.channel.stopTyping();
        }).catch(error => {
            let err = errorH.res(error);
            const embed = new Discord.RichEmbed();
            embed.setAuthor('Error', message.client.user.displayAvatarURL);
            embed.setColor(config.colors.error);
            embed.addField('The following error occurred', err);
            embed.setFooter('kuvuBot v4.2.0');
            embed.setTimestamp();
            message.channel.send(embed).catch(() => {});
            message.channel.stopTyping();
        });
    } else {
        if(message.guild) {
            await db.addXP(message.author.id, guildID, message);
        }
    }
});

client.login(config.token);
