'use strict';

const Discord = require('discord.js');

exports.info = {
    command: 'użytkownik',
    help: {
        command: 'użytkownik [użytkownik]',
        description: 'wyświetla informacje o użytkowniku',
        category: 'Informacyjne'
    },
    aliases: [
        'user'
    ]
};

exports.function = async (parameters) => {
    const config = parameters.config;
    const message = parameters.message;

    const user = (message.mentions.users.first() ? message.mentions.users.first() : message.author);

    const embed = new Discord.RichEmbed();
    embed.setAuthor('Informacje o użytkowniku', message.client.user.displayAvatarURL);
    embed.setColor(config.colors.default);
    embed.setThumbnail(user.displayAvatarURL);
    embed.setDescription(`**Discord tag** \`${user.tag}\`\n**ID** \`${user.id}\`\n**Rejestracja** \`${user.createdAt}\``);
    embed.setFooter('kuvuBot v4.1.0');
    embed.setTimestamp();

    await message.channel.send(embed);
};
