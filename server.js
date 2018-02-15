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

    commands.push({
        command: command.info.command,
        help: {
            command: command.info.help.command,
            description: command.info.help.description
        },
        parameters: command.info.parameters,
        function: command.function
    });
}

const client = new Discord.Client();

client.on('ready', () => {
    client.user.setActivity(`.pomoc | v${packageInfo.version}`);
    console.log('Client is ready!');
});

client.on('message', message => {
    if(message.author.bot) return;

    const args = message.content.trim().split(/\s+/);
    const command = commands.find(command => command.command === args[0]);

    if(command) {
        message.channel.startTyping();

        const parametersUnused = {
            args: args,
            commands: commands,
            config: config,
            message: message
        };

        const parameters = {};

        for(const parameter of command.parameters) {
            parameters[parameter] = parametersUnused[parameter];
        }

        command.function(parameters).then(() => {
            message.channel.stopTyping();
        }).catch(error => {
            message.reply('wystąpił błąd!');
            message.channel.stopTyping();
            console.error(error);
        });
    }
});

client.login(config.token);
