'use strict';
const redis = require('redis');
const { REDIS_URL } = process.env;

// const client = redis.createClient({
//     url: REDIS_URL
// });

// client.ping(function (err, result) {
//     console.log(result);
// });

// client.on('connect', () => {
//     console.log('connect success');
// });

// client.on('error', (error) => {
//     console.log(error);
// });

// module.exports = client;

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
        console.log(`connectionRedis - Connection status: connected`);
    });

    connectionRedis.on(statusConnectRedis.END, () => {
        console.log(`connectionRedis - Connection status: disconnected`);
    });

    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log(`connectionRedis - Connection status: reconnecting`);
    });

    connectionRedis.on(statusConnectRedis.ERROR, (err) => {
        console.log(`connectionRedis - Connection status: error ${err}`);
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
