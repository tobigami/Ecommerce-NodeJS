'use strict';

const amqplib = require('amqplib');

const consumer = async () => {
    try {
        const connection = await amqplib.connect('amqp://guest:guest@localhost');

        const channel = await connection.createChannel();
        const queueName = 'order-message';

        await channel.assertQueue(queueName, {
            durable: true
        });

        // set prefetch to 1 ensure only one ack at a time
        channel.prefetch(1);

        channel.consume(queueName, (msg) => {
            const message = msg.content.toString();
            setTimeout(() => {
                console.log('processed', message);
                channel.ack(msg);
            }, Math.random() * 1000);
        });
    } catch (error) {
        console.log(error);
    }
};

consumer().catch((error) => console.log(error));
