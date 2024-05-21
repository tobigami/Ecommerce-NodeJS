'use strict';
const redis = require('redis');
const { REDIS_URL } = process.env;

let client = {},
    statusConnectRedis = {
        CONNECT: 'connect', // kich hoat sau khi connect thanh cong
        END: 'end', // kich hoat khi ket noi bi ngat
        RECONNECT: 'reconnecting', // kich hoat khi redis co gang ket noi lai khi xay ra su kien END
        ERROR: 'error' // kich hoat khi co bat ky loi gi xay ra trong qua trinh connect
    };

const handleEventConnection = ({ connectionRedis }) => {
    // check is null ....
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log(`\x1b[32m connectionRedis - Connection status: \x1b[32m connected`);
    });

    connectionRedis.on(statusConnectRedis.END, () => {
        console.log(`connectionRedis - Connection status: \x1b[31m disconnected`);
    });

    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log(`connectionRedis - Connection status: reconnecting`);
    });

    connectionRedis.on(statusConnectRedis.ERROR, (err) => {
        console.log(`connectionRedis - Connection status: error \x1b[31m ${err}`);
    });
};

const initRedis = () => {
    const instanceRedis = redis.createClient({
        url: REDIS_URL
    });

    client.instanceRedis = instanceRedis;
    handleEventConnection({ connectionRedis: instanceRedis });
};

const getRedis = () => client;

const closeRedis = () => {
    //....
};

module.exports = {
    initRedis,
    getRedis,
    closeRedis
};
