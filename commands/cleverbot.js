'use strict';

const cleverbotAsPromised = require('cleverbot-as-promised');

const csCache = {};

exports.info = {
    command: '.zapytaj',
    help: {
        command: '.zapytaj <pytanie>',
        description: 'zadaje pytanie cleverbotowi'
    },
    parameters: [
        'args',
        'config',
        'message'
    ]
};

exports.function = async (parameters) => {
    const args = parameters.args;
    const config = parameters.config;
    const message = parameters.message;

    const question = args.slice(1).join(' ');

    if(!question) {
        message.reply('prawidłowe użycie: `!zapytaj <pytanie>`!');
    } else {
        const cleverbotClient = new cleverbotAsPromised(config.cleverbotKey);

        const response = await cleverbotClient.getReply({
            key: config.key,
            input: question,
            cs: csCache[message.author.id]
        });

        csCache[message.author.id] = response.cs;
        message.reply(response.output);
    }
};
