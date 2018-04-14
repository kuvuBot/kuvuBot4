'use strict';

const figlet = require('figlet');
const util = require('util');

const makeFiglet = util.promisify(figlet.text);

exports.info = {
    command: '.figlet',
    help: {
        command: '.figlet <tekst>',
        description: 'generuje figlet'
    }
};

exports.function = async (parameters) => {
    const args = parameters.args;
    const message = parameters.message;

    const text = args.slice(1).join(' ');

    if(!text) {
        message.reply('prawidłowe użycie: `.figlet <tekst>`!');
    } else {
        if(text.length > 16) {
            message.reply('tekst nie może mieć więcej niż 16 znaków!');
        } else {
            const figletText = await makeFiglet(text);
            await message.reply('\n\n```\n' + figletText + '\n```');
        }
    }
};
