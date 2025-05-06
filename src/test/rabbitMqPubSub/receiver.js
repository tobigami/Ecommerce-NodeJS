'use strict';

const amqplib = require('amqplib');

const receiver = async () => {
	try {
		// 1. create connection
		const connection = await amqplib.connect('amqp://guest:guest@localhost');

		// 2. create channel
		const channel = await connection.createChannel();

		// 3. create exchange
		const nameExchange = 'Thanh-Youtube';
		await channel.assertExchange(nameExchange, 'fanout', {
			durable: false,
		});

		// 4. create queue
		const { queue } = await channel.assertQueue('', {
			exclusive: true,
		});
		console.log('queue :>> ', queue);

		// 5. binding

		await channel.bindQueue(queue, nameExchange, '');
		await channel.consume(
			queue,
			(message) => {
				console.log('message:', message.content.toString());
			},
			{
				noAck: true,
			},
		);
	} catch (error) {
		console.log(error);
	}
};

receiver();
