'use strict';

const Discord = require('discord.js');
const httpAsPromised = require('http-as-promised');

exports.info = {
    command: 'ii',
    help: {
        command: 'zdelegalizuj [wyraz]',
        description: 'delegalizuje podaną rzecz',
        category: 'img'
    },
    aliases: [
        'delegalize',
        'isillegal',
        'isnowillegal',
        'zdelegalizuj'
    ]
};

exports.function = async (parameters) => {
    const config = parameters.config;
    const args = parameters.args;
    const message = parameters.message;
    const prefix = parameters.prefix;
    const lang = parameters.lang;
    const db = parameters.db;
    const version = parameters.packageInfo.version;

    let word = args[1];

    if (!word) {
        await message.reply(`${await db.get('trans', lang, 'usage')}\`${prefix}${await db.get('trans', lang, 'ii_command')}\`!`);
    } else {
        word = word.toUpperCase();
        if (word.length > 10) {
            await message.reply(await db.get('trans', lang, 'ii_limit'));
        } else if (!/^[a-z0-9]+$/i.test(word)) {
            await message.reply(await db.get('trans', lang, 'ii_chars'));
        } else {
            await httpAsPromised.post('https://is-now-illegal.firebaseio.com/queue/tasks.json', {
                json: true,
                body: {task: 'gif', word: word}
            });

            const gif = JSON.parse(await httpAsPromised.get(`https://is-now-illegal.firebaseio.com/gifs/${word}.json`, {resolve: 'body'}));

            const embed = new Discord.RichEmbed();
            embed.setAuthor(`${word} ${await db.get('trans', lang, 'ii_now')}`, message.client.user.displayAvatarURL);
            embed.setColor(config.colors.default);
            embed.setImage(gif.url);
            embed.setFooter(`kuvuBot ${version}`);
            embed.setTimestamp();

            await message.channel.send(embed);
        }
    }
};
