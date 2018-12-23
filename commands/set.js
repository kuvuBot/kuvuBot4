'use strict';

exports.info = {
    command: 'set',
    help: {
        command: 'set <setting> <value>',
        description: 'set guild settings',
        category: 'mod'
    },
    aliases: [
        'ustaw'
    ]
};

exports.function = async (parameters) => {
    const config = parameters.config;
    const message = parameters.message;
    const guildID = parameters.guildID;
    const lang = parameters.lang;
    const db = parameters.db;
    const args = parameters.args;
    const prefix = parameters.prefix;
    const version = parameters.packageInfo.version;

    const settings = [
        'lang', 'language', 'język', 'jezyk',
        'showlvl','showlevel','pokazujpoziom',
        'prefix',
        'role', 'rola', 'ranga'
    ];

    if(!message.guild) {
        await message.reply(await db.get('trans', lang, 'onlyText'));
    } else {
        if (!message.member.hasPermission('MANAGE_GUILD')) {
            await message.reply(await db.get('trans', lang, 'perms'));
        } else {
            if (settings.includes(args[1])) {
                switch (args[1]) {
                    case 'lang':
                    case 'language':
                    case 'język':
                    case 'jezyk':
                        if (args[2]) {
                            if (args[2] == 'pl' || args[2] == 'en') {
                                await db.update('guilds', guildID, 'lang', args[2]);
                                await message.reply('👌');
                            } else await message.reply(`${await db.get('trans', lang, 'usage')} \`${prefix}${await db.get('trans', lang, 'set_lang_usage')}\`!`);
                        } else await message.reply(`${await db.get('trans', lang, 'usage')} \`${prefix}${await db.get('trans', lang, 'set_lang_usage')}\`!`);
                        break;
                    case 'prefix':
                        if (args[2]) {
                            await db.update('guilds', guildID, 'prefix', args[2]);
                            await message.reply('👌');
                        } else await message.reply(`${await db.get('trans', lang, 'usage')} \`${prefix}${await db.get('trans', lang, 'set_prefix_usage')}\`!`);
                        break;
                    case 'showlvl':
                    case 'showlevel':
                    case 'pokazujpoziom':
                        if (await db.get('lvlToggle', guildID) == 'true') {
                            await db.update('guilds', guildID, 'showlvl', 'false');
                            await message.reply('👌 - off');
                        } else {
                            await db.update('guilds', guildID, 'showlvl', 'true');
                            await message.reply('👌 - on');
                        }
                        break;
                    case 'role':
                    case 'rola':
                        if (args[2]) {
                            let role = message.content.split(' ').slice(2).join(' ');
                            if (role.includes('<@&')) {
                                role = role.replace('<@&', '').replace('>', '');
                            } else if (role.match(/([1-9])+/g)) {
                                if (!message.guild.roles.find(roleA => roleA.id === role)) return message.reply(await db.get('trans', lang, 'role_default_notfound'));
                            } else {
                                if (!message.guild.roles.find(roleA => roleA.name === role)) return message.reply(await db.get('trans', lang, 'role_default_notfound'));
                                role = message.guild.roles.find(roleA => roleA.name === role).id;
                            }
                            await db.update('guilds', guildID, 'role', role);
                            await message.reply('👌');
                        } else await message.reply(`${await db.get('trans', lang, 'usage')} \`${prefix}${await db.get('trans', lang, 'set_role_usage')}\`!`);
                        break;
                }
            } else if (args[1] == 'options' || args[1] == 'opcje') await message.channel.send(`${await db.get('trans', lang, 'set_options')} \n ${await db.get('trans', lang, 'set_options_desc')}`);
            else {
                await message.reply(`${await db.get('trans', lang, 'usage')} \`${prefix}\`${await db.get('trans', lang, 'set_usage')}!`);
                await message.channel.send(`${await db.get('trans', lang, 'set_options')} \n ${await db.get('trans', lang, 'set_options_desc')}`);
            }
        }
    }
};
