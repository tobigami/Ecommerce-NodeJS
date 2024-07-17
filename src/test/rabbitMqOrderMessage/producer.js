'use strict';

const amqplib = require('amqplib');

const producer = async () => {
    try {
        const connection = await amqplib.connect('amqp://guest:guest@localhost');

        const channel = await connection.createChannel();

        const queueName = 'order-message';

        await channel.assertQueue(queueName, {
            durable: true
        });

        for (let i = 0; i < 10; i++) {
            const msg = `message ${i}`;
            channel.sendToQueue(queueName, Buffer.from(msg), {
                persistent: true
            });
        }

        setTimeout(() => {
            connection.close();
            process.exit(0);
        });
    } catch (error) {
        console.log(error);
    }
};

producer().catch((error) => console.log(error));
