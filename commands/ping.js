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
    let message = parameters.message;
    const client = parameters.client;
    const version = parameters.packageInfo.version;

    let firstTs = Date.now();
    message = await message.channel.send('...');
    let secondTs = Date.now();
    let ping = secondTs - firstTs;
    await message.edit(`🏓 Ping: ${ping}ms | Gateway: ${Math.round(client.ping)}ms`);
};
