'use strict';

exports.info = {
    command: 'ping',
    help: {
        command: 'ping',
        description: 'BOT ping',
        category: 'gen'
    }
};

exports.function = async (parameters) => {
    const message = parameters.message;
    const client = parameters.client;

    await message.reply(`🏓 Pong (${client.ping}ms)`);
};
