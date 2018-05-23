'use strict';

const r = require('rethinkdb');

const { database } = require('../config.json');

let connection;
const load = async function load() {
    try {
        await r.connect(database).then(conn => connection = conn);
        await console.log('Creating tables...');
        await r.tableCreate("users").run(connection);
        await r.tableCreate("guilds").run(connection);
        await console.log('Tables created.');
    } catch (e) {
        e = e.toString();
        if (e.includes("already exists in")) {
            console.log('Already exists. Skipping...')
        } else {
            console.error(e);
        }
    }
};

const check = async function check(gid) {
    await r.connect(database).then(conn => connection = conn);
    if (await r.table("guilds").get(gid).run(connection)) {
        return true;
    } else {
        try {
            await r.table("guilds").insert({
                "id": gid,
                "lang": "en",
                "logchannel": "none",
                "greeting": false,
                "prefix": "kb!"
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
            await r.connect(database).then(conn => connection = conn);
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

const getTrans = async function getTrans(id, w) {
    if(id && w){
        try {
            await r.connect(database).then(conn => connection = conn);

            const guild = await r.table('guilds').get(id).toJSON().run(connection);
            const lang = await JSON.parse(guild).lang;

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
            await r.connect(database).then(conn => connection = conn);

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

exports.check = check;
exports.load = load;
exports.update = update;
exports.getTrans = getTrans;
exports.getPrefix = getPrefix;
