const app = require('./src/app');
const mongoose = require('mongoose');
const { PORT } = process.env;

const server = app.listen(PORT, () => {
    console.log(
        `\x1b[32m Server eCommerce is running with port: \x1b[34m${PORT}`,
    );
});

process.on('SIGINT', () => {
    server.close(() => {
        mongoose.disconnect();
        console.log('\x1b[31mServer is close');
    });
});
