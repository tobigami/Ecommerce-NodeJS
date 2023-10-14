'use strict';

const {
    DEV_APP_PORT,
    DEV_DB_PORT,
    DEV_DB_NAME,
    PRO_APP_PORT,
    PRO_DB_PORT,
    PRO_DB_NAME,
    ENVIRONMENT,
} = process.env;

// level 0
// const config = {
//     app: {
//         port: 3000
//     },
//     db: {
//         host: '127.0.0.1',
//         name: 'shopDEV'
//     }
// }

// level 1
const dev = {
    app: {
        port: DEV_APP_PORT,
    },
    db: {
        host: DEV_DB_PORT,
        name: DEV_DB_NAME,
    },
};

const pro = {
    app: {
        port: PRO_APP_PORT,
    },
    db: {
        host: PRO_DB_PORT,
        name: PRO_DB_NAME,
    },
};

const config = { dev, pro };
module.exports = config[ENVIRONMENT || 'dev'];
