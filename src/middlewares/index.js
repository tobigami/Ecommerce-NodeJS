'use strict';

const Logger = require('../log/discord.log');

const pushLogToDiscord = async (req, res, next) => {
    try {
        console.log('req', req);
        Logger.sendToFormatCode({
            title: `Method" ${req.method}`,
            code: req.method === 'GET' ? req.query : req.body,
            message: `${req.get('host')}${req.originalUrl}`
        });
        return next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    pushLogToDiscord
};
