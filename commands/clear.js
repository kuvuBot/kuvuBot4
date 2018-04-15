'use strict';

const Discord = require('discord.js');

exports.info = {
    command: 'czyść',
    help: {
        command: 'czyść <liczba wiadomości>',
        description: 'usuwa podaną liczbę wiadomości',
        category: 'Moderacyjne'
    },
    aliases: [
        'clear',
        'prune',
        'czysc'
    ]
};

exports.function = async (parameters) => {
    const args = parameters.args;
    const message = parameters.message;
    const prefix = parameters.prefix;

    const limit = args[1];
    const filter = args[2];

    function getFilter(message, filter, user) {
        switch (filter) {
            case 'link': return mes => /https?:\/\/[^ /.]+\.[^ /.]+/.test(mes.content);
            case 'invite': return mes => /(https?:\/\/)?(www\.)?(discord\.(gg|li|me|io)|discordapp\.com\/invite)\/.+/.test(mes.content);
            case 'bots': return mes => mes.author.bot;
            case 'you': return mes => mes.author.id === this.client.user.id;
            case 'me': return mes => mes.author.id === message.author.id;
            case 'upload': return mes => mes.attachments.size > 0;
            case 'user': return mes => mes.author.id === user.id;
            default: return () => true;
        }
    }

    if(!message.guild) {
        await message.reply('ta komenda jest dostępna tylko na serwerach!');
    } else {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
            await message.reply('nie masz wystarczających uprawnień, aby wykonać tą komendę!');
        } else {
            if (isNaN(limit)) {
                await message.reply('prawidłowe użycie: `kb!clear <liczba wiadomości>`!');
            } else {
                let messages = await message.channel.fetchMessages({ limit: 100 });
                if (filter) {
                    const user = typeof filter !== 'string' ? filter : null;
                    const type = typeof filter === 'string' ? filter : 'user';
                    messages = messages.filter(getFilter(message, type, user));
                }
                messages = messages.array().slice(0, limit);
                await message.channel.bulkDelete(messages);
                if (filter != null) {
                    await message.channel.send(`Pomyślnie usunięto ${messages.length} z ${limit} wiadomości z filtrem ${filter}!`);
                }
                else {
                    await message.channel.send(`Pomyślnie usunięto ${messages.length} z ${limit} wiadomości!`);
                }
            }
        }
    }
};
