'use strict';

const amqplib = require('amqplib');

const log = console.log;
console.log = function () {
    log.apply(console, [new Date()].concat(arguments));
};

const runProducer = async () => {
    try {
        const connection = await amqplib.connect('amqp://guest:guest@localhost');
        const channel = await connection.createChannel();

        const notificationExchange = 'notificationEx';
        const notifyQueue = 'notificationQueueProcess';
        const notificationExchangeEX = 'notificationExDLX';
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX';

        // 1. create Exchange
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true
        });

        // 2. create queue
        const queueResult = await channel.assertQueue(notifyQueue, {
            exclusive: false, //  cho phep cac ket noi truy cap vao cung 1 luc hang doi
            deadLetterExchange: notificationExchangeEX,
            deadLetterRoutingKey: notificationRoutingKeyDLX
        });

        // 3. bind queue
        await channel.bindQueue(queueResult.queue, notificationExchange);

        // 4. send message
        const mgs = 'a new product created';
        console.log(`producer msg:`, mgs);
        await channel.sendToQueue(queueResult.queue, Buffer.from(mgs), {
            expiration: 10 * 1000
        });

        // 5. exit
        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

runProducer();
