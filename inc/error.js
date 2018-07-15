'use strict'

const res = function res(error) {
    try {
        if (error.message.includes('404 Not Found')) {
            return 'Not found.';
        } else if (error.message.includes(`Cannot read property 'id'`)) {
            return 'API error.';
        } else if (error.message.includes(`Cannot read property 'lvl'`)) {
            return 'User data not found.';
        } else if (error.message.includes('Missing Permissions')) {
            return 'Missing BOT Permissions.';
        }
        else {
            console.error(error);
            return error;
        }
    } catch (e) {
        return error;
    }
};

exports.res = res;
