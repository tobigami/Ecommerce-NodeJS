'use strict';

const amqplib = require('amqplib');

const sendEmail = async () => {
	try {
		// 1. create connection
		const connection = await amqplib.connect('amqp://guest:guest@localhost');

		// 2. create channel
		const channel = await connection.createChannel();

		// 3. create exchange
		const nameExchange = 'SendEmail';
		await channel.assertExchange(nameExchange, 'topic', {
			durable: true,
		});

		const agrs = process.argv.slice(2);
		const mgs = agrs[1] || 'Fixed';
		const topic = agrs[0];
		// 4. publish
		await channel.publish(nameExchange, topic, Buffer.from(mgs));
		setTimeout(() => {
			connection.close();
			process.exit(0);
		}, 1000);
	} catch (error) {
		console.log(error);
	}
};

sendEmail();
