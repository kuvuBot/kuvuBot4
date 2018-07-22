'use strict';

const figlet = require('figlet');
const util = require('util');

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
    const lang = parameters.lang;
    const db = parameters.db;
    const version = parameters.packageInfo.version;

    const text = args.slice(1).join(' ');

    if(!text) {
        await message.reply(`${await db.getTrans(lang, 'usage')}\`${prefix}${await db.getTrans(lang, 'figlet_command')}\`!`);
    } else {
        if(text.length > 16) {
            await message.reply(await db.getTrans(lang, 'figlet_limit'));
        } else {
            const figletText = await makeFiglet(text);
            await message.reply('\n\n```\n' + figletText + '\n```');
        }
    }
};
