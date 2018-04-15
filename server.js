'use strict';

const fs = require('fs');
const path = require('path');

const Discord = require('discord.js');

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
    client.user.setPresence({ game: { name: `kb!pomoc | ${client.guilds.size} gildii`, type: 'LISTENING' }, status: 'online' });
    console.log('Client is ready!');
});

client.on('message', message => {
    if(message.author.bot) return;

    const prefix = config.prefix;

    const args = message.content.toLowerCase().trim().split(/\s+/);
    const command = commands.find(command => prefix + command.info.command === args[0] || (command.info.aliases ? command.info.aliases.find(alias => prefix + alias === args[0]) : false));

    if(command) {
        message.channel.startTyping();

        const parameters = {
            args,
            commands,
            config,
            message,
            packageInfo,
            prefix
        };

        command.function(parameters).then(() => {
            message.channel.stopTyping();
        }).catch(error => {
            if(!(error instanceof Discord.DiscordAPIError)) {
                console.error(error);
            }
            message.reply('wystąpił błąd!').catch(() => {});
            message.channel.stopTyping();
        });
    }
});

client.login(config.token);
