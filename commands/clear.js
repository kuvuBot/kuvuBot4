'use strict';

const Discord = require('discord.js');

exports.info = {
    command: '.czyść',
    help: {
        command: '.czyść <liczba wiadomości>',
        description: 'usuwa podaną liczbę wiadomości'
    },
    aliases: [
        '.clear'
    ]
};

exports.function = async (parameters) => {
    const args = parameters.args;
    const message = parameters.message;

    if(!message.guild) {
        await message.reply('ta komenda jest dostępna tylko na serwerach!');
    } else {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
            await message.reply('nie masz wystarczających uprawnień, aby wykonać tą komendę!');
        } else {
            const messages = args[1];

            if (isNaN(messages)) {
                await message.reply('prawidłowe użycie: `.czyść <liczba wiadomości>`!');
            } else {
                if (messages < 2) {
                    await message.reply('ilość wiadomości nie może być mniejsza niż 2!');
                } else if (messages > 100) {
                    await message.reply('ilość wiadomości nie może być większa niż 100!');
                } else {
                    const deletedMessages = await message.channel.bulkDelete(messages);
                    await message.reply(`pomyślnie usunięto ${deletedMessages.size} wiadomości!`);
                }
            }
        }
    }
};
