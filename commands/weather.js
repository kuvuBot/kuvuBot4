'use strict';

const Discord = require('discord.js');
const httpAsPromised = require('http-as-promised');

exports.info = {
    command: 'weather',
    help: {
        command: 'pogoda <miasto>',
        description: 'wyświetla pogodę dla danego miasta',
        category: 'info'
    },
    aliases: [
        'pogoda'
    ]
};

exports.function = async (parameters) => {
    const args = parameters.args;
    const config = parameters.config;
    const message = parameters.message;
    const prefix = parameters.prefix;
    const lang = parameters.lang;
    const db = parameters.db;

    const city = encodeURIComponent(args[1]);
    const conds = {
        Clear: `🌞 ${await db.getTrans(lang, 'weather_cond_sun')}`,
        Clouds: `🌥 ${await db.getTrans(lang, 'weather_cond_clouds')}`,
        Rain: `🌧 ${await db.getTrans(lang, 'weather_cond_rain')}`,
        Drizzle: `🌦 ${await db.getTrans(lang, 'weather_cond_drizzle')}`,
        Thunderstorm: `⛈ ${await db.getTrans(lang, 'weather_cond_thund')}`,
        Snow: `🌨 ${await db.getTrans(lang, 'weather_cond_snow')}`,
        Atmosphere: `🌁 ${await db.getTrans(lang, 'weather_cond_atm')}`,
        Extreme: `🌪 ${await db.getTrans(lang, 'weather_cond_ext')}`,
        Additional: `❔ ${await db.getTrans(lang, 'weather_cond_add')}`
    };

    if(!city) {
        await message.reply(`${await db.getTrans(lang, 'usage')}\`${prefix}${await db.getTrans(lang, 'weather_command')}\`!`);
    }

    const weather = JSON.parse(await httpAsPromised.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${config.weatherKey}&lang=en&units=metric`, { resolve: 'body' }));

    let wCondition = weather.weather[0].main.replace(/Clear|Clouds|Rain|Drizzle|Thunderstorm|Snow|Atmosphere|Extreme|Additional/gi, function(matched){
        matched = matched.replace(/\s/g, '_');
        return conds[matched];
    });

    const embed = new Discord.RichEmbed();
    embed.setAuthor('Pogoda', message.client.user.displayAvatarURL);
    embed.setColor(config.colors.default);

    embed.addField(await db.getTrans(lang, 'weather_city'), '🏙 ' + weather.name);
    embed.addField(await db.getTrans(lang, 'weather_cond'), wCondition);
    embed.addField(await db.getTrans(lang, 'weather_temp'), '🌡 '  + weather.main.temp + '℃', true);
    embed.addField(await db.getTrans(lang, 'weather_press'), '🎈 '  + weather.main.pressure + ' hPa', true);
    embed.addField(await db.getTrans(lang, 'weather_hum'), '♨ '  + weather.main.humidity + '%', true);
    embed.setFooter('kuvuBot v4.2.0');
    embed.setTimestamp();

    await message.channel.send(embed);
};
