
'use strict';

const Discord = require('discord.js');

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
    const lang = parameters.lang;
    const db = parameters.db;
    const version = parameters.packageInfo.version;

    let broadcast = args.slice(1).join(' ');

    if (!message.guild) {
        await message.reply(await db.get('trans', lang, 'onlyText'));
    } else {
        if (!broadcast) {
            await message.reply(`${await db.get('trans', lang, 'usage')} \`${prefix}${await db.get('trans', lang, 'bc_command')}\`!`);
        } else {
            if (!message.member.hasPermission('MANAGE_MESSAGES')) {
                await message.reply(await db.get('trans', lang, 'perms'));
            } else {
                broadcast = broadcast.charAt(0).toUpperCase() + broadcast.slice(1);

                const embed = new Discord.RichEmbed();
                embed.setAuthor(await db.get('trans', lang, 'bc_title'), message.client.user.displayAvatarURL);
                embed.setDescription(broadcast);
                embed.setColor(config.colors.default);
                embed.setFooter(`kuvuBot ${version}`);
                embed.setTimestamp();

                await message.channel.send(embed);
            }
        }
    }
};
