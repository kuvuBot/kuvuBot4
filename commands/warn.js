'use strict';

const Discord = require('discord.js');

exports.info = {
    command: 'warn',
    help: {
        command: 'warn <@user_mention> <warn points> | <warn reason>',
        description: 'warns user',
        category: 'mod'
    },
    aliases: [
        'ostrzeż',
        'ostrzez'
    ],
    show: false
};

exports.function = async (parameters) => {
    let args = parameters.args;
    const config = parameters.config;
    const message = parameters.message;
    const prefix = parameters.prefix;
    const lang = parameters.lang;
    const db = parameters.db;
    const version = parameters.packageInfo.version;
    const guildID = parameters.guildID;

    if(!message.guild) {
        await message.reply(await db.get('trans', lang, 'onlyText'));
    } else {
        if (args[1]) {
            let msg = message.content.trim().split('|');
            if (!args[2]) args[2] = 10;
            if (!msg[1]) msg[1] = 'No reason';
            if(isNaN(args[2])) args[2] = 10;
            if (isNaN(msg[0])) msg[0] = 10;
            await db.warn(message.mentions.users.first().id, guildID, args[2], msg[1]);

            let successMsg = await db.get('trans', lang, 'warn_success');

            successMsg = successMsg.replace('{user}', message.mentions.users.first()).replace('{pkt}', args[2]).replace('{reason}', msg[1]);
            
            const embed = new Discord.RichEmbed();
            embed.setAuthor(await db.get('trans', lang, 'warn_title'), message.client.user.displayAvatarURL);
            embed.setColor(config.colors.error);
            embed.setDescription(successMsg);
            embed.setFooter(`kuvuBot ${version}`);
            embed.setTimestamp();
            await message.channel.send(embed);
        } else {
            await message.reply(`${await db.get('trans', lang, 'usage')} \`${prefix}${await db.get('trans', lang, 'warn_command')}\`!`);
        }
    }
};
