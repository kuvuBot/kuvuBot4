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
const getLang = async function getLang(id) {
    if(id) {
        try {
            const guild = await r.table('guilds').get(id).toJSON().run(connection);
            const lang = await JSON.parse(guild).lang;

            return lang;
        } catch(e) {
            console.error(e);
            return false;
        }
    }
    
};
const getTrans = async function getTrans(lang, w) {
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
};

const getPrefix = async function getPrefix(id) {
    if(id){
        try {
            const guild = await r.table('guilds').get(id).toJSON().run(connection);
            const prefix = await JSON.parse(guild).prefix;

            return prefix;
        } catch (e) {
            console.error(e);
            return false;
        }
    } else {
        return false;
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

exports.updateStats = updateStats;
exports.check = check;
exports.load = load;
exports.update = update;
exports.getTrans = getTrans;
exports.getLang = getLang;
exports.getPrefix = getPrefix;
