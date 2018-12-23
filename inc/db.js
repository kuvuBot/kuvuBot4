'use strict';

const r = require('rethinkdb');
const { database } = require('../config.json');

let connection;
const load = async function load() {
    try {
        connection = await r.connect(database);
        console.log('Creating tables...');
        await Promise.all([
            r.tableCreate("users").run(connection),
            r.tableCreate("guilds").run(connection),
            r.tableCreate("bot").run(connection)
        ]);
        console.log('Tables created.');
    } catch(error) {
        if (error.message.includes('already exists in')) {
            console.log('Already exists. Skipping...');
        } else {
            console.error(error);
        }
    }
};

const check = async function check(gid) {
    if (await r.table("guilds").get(gid).run(connection)) {
        return true;
    } else {
        try {
            await r.table("guilds").insert({
                "id": gid,
                "lang": "en",
                "logchannel": "none",
                "greeting": false,
                "role": false,
                "prefix": "kb!",
                "users": []
            }).run(connection);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
};

const update = async function update(obj, id, k, v) {
    if(obj && id && k && v){
        try {
            await r.table(obj).get(id).update({[k]: v}).run(connection);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
     } else {
        return false;
    }
};

const get = async function get(str, one, two) {
    if (!str) return false;
    if (!one) return false;
    let id = one;
    switch(str) {
        case 'lang':
            try {
                const guild = await r.table('guilds').get(id).toJSON().run(connection);
                const lang = await JSON.parse(guild).lang;

                return lang;
            } catch(e) {
                console.error(e);
                return false;
            }
            break;
        case 'trans':
            let lang = one, w = two;
            if(lang && w){
                try {
                    let langFile = require(`../langs/${lang}.json`);
                    return langFile[w];
                } catch (e) {
                    console.error(e);
                    return false;
                }
            } else {
                return ' [Translation not found] ';
            }
            break;
        case 'logChannel':
            try {
                const guild = await r.table('guilds').get(id).toJSON().run(connection);
                const logChannel = await JSON.parse(guild).logchannel;

                if (logChannel == 'none') return false;

                return logChannel;
            } catch(e) {
                console.error(e);
                return false;
            }
            break;
        case 'prefix':
            try {
                const guild = await r.table('guilds').get(id).toJSON().run(connection);
                const prefix = await JSON.parse(guild).prefix;

                return prefix;
            } catch (e) {
                console.error(e);
                return false;
            }
            break;
        case 'lvlToggle':
            try {
                const guild = await r.table('guilds').get(id).toJSON().run(connection);
                const status = await JSON.parse(guild).showlvl;
                if(status) {
                    return status;
                } else {
                    await r.table('guilds').get(id).update({showlvl: 'false'}).run(connection);
                    return 'true';
                }

            } catch (e) {
                console.error(e);
                return false;
            }
            break;
        case 'role':
            try {
                const guild = await r.table('guilds').get(id).toJSON().run(connection);
                const role = await JSON.parse(guild).role;
                if(role) {
                    if (role != 'false') return role;
                    else return false;
                } else {
                    await r.table('guilds').get(id).update({role: 'false'}).run(connection);
                    return false;
                }

            } catch (e) {
                console.error(e);
                return false;
            }
            break;
    }
};

const updateStats = async function update(g, c, u) {
    if(g && c && u){
        try {
            await r.table('bot').get(1).update({guilds: g, channels: c, users: u}).run(connection);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    } else {
        return false;
    }
};

const addXP = async function addXP(user, guild, message) {
    if(user && guild) {
        try { 
            let msg = message.content.trim().split(/\s/).join('');
            if (msg.length < 6) return;

            const g = await r.table('guilds').get(guild).toJSON().run(connection);
            const json = await JSON.parse(g);
            if (json.users) {
                const users = json.users;   
                    if(users[user]) {                
                        let us = users[user];

                        let xp = us.xp;
                        let lvl = us.lvl;
                        let lvlProm = us.lvlProm;

                        let newXP = Math.floor(Math.random() * Math.ceil(msg.length / 2)+3); 
                        let totalXP = xp + newXP;

                        if(totalXP >= lvlProm) {
                            totalXP = 0;
                            lvl++;
                            lvlProm = Math.floor(((lvlProm+newXP)*2)-(lvlProm-newXP)*0.70);
                            if (await get('lvlToggle', guild) == true) { 
                                let anc = await get('trans', await get('lang', message.guild.id), 'lvl_up');
                                anc = anc.replace('{author}', message.author.id)
                                        .replace('{lvl}', lvl);
                                await message.channel.send(anc);
                            }
                        }
                        await r.table('guilds').get(guild).update({
                            users: r.object(user, r.object('lvl', lvl, 'xp', totalXP, 'lvlProm', lvlProm))
                        }).run(connection);
                    } else {
                        await r.table('guilds').get(guild).update({
                            users: r.object(user, r.object('lvl', 1, 'xp', 0, 'lvlProm', 65))
                        }).run(connection);
                    }
            } else {
                await r.table('guilds').get(guild).update({users: { }}).run(connection);
                await r.table('guilds').get(guild).update({
                    users: r.object(user, r.object('lvl', 1, 'xp', 0, 'lvlProm', 65))
                }).run(connection);
            }
        } catch (e) {
            console.error(e);
            return false;
        }
    }
}

const getUser = async function getUser(user, guild) {
    const g = await r.table('guilds').get(guild).toJSON().run(connection);
    const json = await JSON.parse(g);
    if (json.users) {
        const users = json.users;   
            if(users[user]) {                
                let us = users[user];

                let xp = us.xp;
                let lvl = us.lvl;
                let lvlProm = us.lvlProm;

                return {xp,lvl,lvlProm};
            } else {
                await r.table('guilds').get(guild).update({
                    users: r.object(user, r.object('lvl', 0, 'xp', 0, 'lvlProm', 80))
                }).run(connection);
            }
    } else {
        await r.table('guilds').get(guild).update({users: { }}).run(connection);
        await r.table('guilds').get(guild).update({
            users: r.object(user, r.object('lvl', 0, 'xp', 0, 'lvlProm', 89))
        }).run(connection);
        let xp = 0;
        let lvl = 0;
        let lvlProm = 80;
        return {xp,lvl,lvlProm};
    }
}

const warn = async function warn(user, guildID, pkt, reason) {
    if(user && guildID && pkt && reason) {
        try {
            if (!pkt) {
                pkt = 10;
            }
            if (!reason) {
                reason = 'No reason';
            }
            const gi = await r.table('guilds').get(guildID).toJSON().run(connection);
            
            const json = await JSON.parse(gi);
            if (json.users) {
                const users = json.users;   
                    if(users[user]) {                
                        let us = users[user];

                        let warns = us.warns;
                        let warnReasons = us.warnreasons + ' | ' + reason;

                        let warnPoints = parseInt(warns) + parseInt(pkt);
                        let warnBlock = false, warnTime = null;
                        if(warnPoints >= 100) {
                            warnBlock = true;
                            warnTime = Date.now();
                        }
                        await r.table('guilds').get(guildID).update({
                            users: r.object(user, r.object('warns', warnPoints, 'warnreasons', warnReasons, 'warnblock', warnBlock, 'warntime', warnTime))
                        }).run(connection);
                    } else {
                        await r.table('guilds').get(guildID).update({
                            users: r.object(user, r.object('warns', warnPoints, 'warnreasons', warnReasons, 'warnblock', warnBlock, 'warntime', warnTime))
                        }).run(connection);
                    }
            } else {
                await r.table('guilds').get(guildID).update({users: { }}).run(connection);
                await r.table('guilds').get(guildID).update({
                    users: r.object(user, r.object('warns', warnPoints, 'warnreasons', warnReasons, 'warnblock', warnBlock, 'warntime', warnTime))
                }).run(connection);
            }
        } catch (e) {
            console.error(e);
            return false;
        }
    }
}

exports.updateStats = updateStats;
exports.check = check;
exports.load = load;
exports.update = update;
exports.get = get;
exports.addXP = addXP;
exports.getUser = getUser;
exports.warn = warn;
