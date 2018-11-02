'use strict';

const Discord = require('discord.js');

const r = require('rethinkdb');
const { database } = require('../config.json');

exports.info = {
    command: 'eval',
    help: {
        command: 'eval <string>',
        description: 'aval',
        category: 'mod'
    },
    show: false
};

exports.function = async (parameters) => {
    const config = parameters.config;
    const message = parameters.message;
    const args = parameters.args;
    const version = parameters.packageInfo.version;
    const commands = parameters.commands;
    const packageInfo = parameters.packageInfo;
    const prefix = parameters.prefix;
    const guildID = parameters.guildID;
    const lang = parameters.lang;
    const client = parameters.client;
    const db = parameters.db;

    if (!message.author.id === config.owner) {
         await message.reply('Only BOT owner can do this, sorry.');
    } else {
    const db = parameters.db;
        let content = args.slice(1).join(' ');
        if (!content) return await message.reply('No code provided.');
        try {
            return eval(content);
        } catch (e) {
            await message.reply(e.message);
        }
        
    }
};
