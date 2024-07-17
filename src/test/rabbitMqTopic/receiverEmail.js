'use strict';

const amqplib = require('amqplib');

const receiverEmail = async () => {
    // 1. create connection
    const connection = await amqplib.connect('amqp://guest:guest@localhost');

    // 2. create channel
    const channel = await connection.createChannel();

    // 3. create exchange

    const nameExchange = 'SendEmail';
    await channel.assertExchange(nameExchange, 'topic', {
        durable: true
    });

    // 4. create queue
    const { queue } = await channel.assertQueue('', {
        exclusive: true
    });

    // 5. bindding
    /**
     * co nghia la phu hop voi bat ki ky tu nap
     # khop voi 1 hoac nhieu tu bat ki
     */

    const agrs = process.argv.slice(2);
    if (!agrs.length) {
        process.exit(0);
    }

    console.log(`queue:::${queue} || topic:::${agrs}`);

    agrs.forEach(async (key) => {
        await channel.bindQueue(queue, nameExchange, key);
    });

    // 6. send email
    await channel.consume(queue, (mgs) => {
        console.log(`routing::: ${mgs.fields.routingKey} content:::${mgs.content.toString()}`);
    });
};

receiverEmail();
