'use strict';

const figlet = require('figlet');
const util = require('util');
const db = require('../database/db.js');

const makeFiglet = util.promisify(figlet.text);

exports.info = {
    command: 'figlet',
    help: {
        command: 'figlet <tekst>',
        description: 'generuje figlet',
        category: 'fun'
    }
};

exports.function = async (parameters) => {
    const args = parameters.args;
    const message = parameters.message;
    const prefix = parameters.prefix;

    let guildID;
    if(!message.guild) {
        guildID = '0';
    } else {
        guildID = message.guild.id;
    }
    await db.check(guildID);

    const text = args.slice(1).join(' ');

    if(!text) {
        await message.reply(`${await db.getTrans(guildID, 'usage')}\`${prefix}${await db.getTrans(guildID, 'figlet_command')}\`!`);
    } else {
        if(text.length > 16) {
            await message.reply(await db.getTrans(guildID, 'figlet_limit'));
        } else {
            const figletText = await makeFiglet(text);
            await message.reply('\n\n```\n' + figletText + '\n```');
        }
    }
};
