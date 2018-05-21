'use strict';

const Discord = require('discord.js');
const db = require('../database/db.js');

exports.info = {
    command: 'bc',
    help: {
        command: 'ogłoszenie <treść ogłoszenia>',
        description: 'dodaje ogłoszenie',
        category: 'mod'
    },
    aliases: [
        'broadcast',
        'ogłoszenie',
        'ogloszenie',
        'ogl'
    ]
};

exports.function = async (parameters) => {
    const args = parameters.args;
    const config = parameters.config;
    const message = parameters.message;
    const prefix = parameters.prefix;

    let guildID;
    if(!message.guild) {
        guildID = '0';
    } else {
        guildID = message.guild.id;
    }
    await db.check(guildID);

    const broadcast = args.slice(1).join(' ');

    if (!message.guild) {
        await message.reply(await db.getTrans(guildID, 'onlyText'));
    } else {
        if (!broadcast) {
            await message.reply(`${await db.getTrans(guildID, 'usage')} \`${prefix}${await db.getTrans(guildID, 'bc_command')}\`!`);
        } else {
            if (!message.member.hasPermission('MANAGE_MESSAGES')) {
                await message.reply(await db.getTrans(guildID, 'perms'));
            } else {
                await message.delete();

                const embed = new Discord.RichEmbed();
                embed.setAuthor(await db.getTrans(guildID, 'bc_title'), message.client.user.displayAvatarURL);
                embed.setDescription(broadcast);
                embed.setColor(config.colors.default);
                embed.setFooter('kuvuBot v4.1.0');
                embed.setTimestamp();

                await message.channel.send(embed);
            }
        }
    }
};
