'use strict';

const Discord = require('discord.js');
const httpAsPromised = require('http-as-promised');

exports.info = {
    command: 'pogoda',
    help: {
        command: 'pogoda <miasto>',
        description: 'wyświetla pogodę dla danego miasta',
        category: 'Informacyjne'
    },
    aliases: [
        'weather'
    ]
};

exports.function = async (parameters) => {
    const args = parameters.args;
    const config = parameters.config;
    const message = parameters.message;

    const city = encodeURIComponent(args[1]);
    const emojis = {
        Clear: '🌞 Słonecznie',
        Clouds: '🌥 Pochmurnie',
        Rain: '🌧 Deszcz',
        Drizzle: '🌦 Mrzawka',
        Thunderstorm: '⛈ Burza',
        Snow: '🌨 Śnieg',
        Atmosphere: '🌁 Mgła',
        Extreme: '🌪',
        Additional: '❔'
    };

    if(!city) {
        await message.reply('prawidłowe użycie: `.pogoda <miasto>`!');
    }

    const weather = JSON.parse(await httpAsPromised.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${config.weatherKey}&lang=en&units=metric`, { resolve: 'body' }));

    let wCondition = weather.weather[0].main.replace(/Clear|Clouds|Rain|Drizzle|Thunderstorm|Snow|Atmosphere|Extreme|Additional/gi, function(matched){
        matched = matched.replace(/\s/g, '_');
        return emojis[matched];
    });

    const embed = new Discord.RichEmbed();
    embed.setAuthor('Pogoda', message.client.user.displayAvatarURL);
    embed.setColor(config.colors.default);

    embed.addField('Miasto', '🏙 ' + city);
    embed.addField('Warunki pogodowe', wCondition);
    embed.addField('Temperatura', '🌡 '  + weather.main.temp + '℃', true);
    embed.addField('Ciśnienie', '🎈 '  + weather.main.pressure + ' hPa', true);
    embed.addField('Wilgotność', '♨ '  + weather.main.humidity + '%', true);

    await message.channel.send(embed);
};
