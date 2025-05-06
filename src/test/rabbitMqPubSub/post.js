'use strict';

const amqplib = require('amqplib');

const publish = async ({ msg }) => {
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

		// 4. publish

		await channel.publish(nameExchange, '', Buffer.from(msg));
		console.log('Send ok :>> ', msg);

		setTimeout(() => {
			connection.close();
			process.exit(0);
		}, 1000);
	} catch (error) {
		console.log(error);
	}
};

const msg = process.argv.slice(2).join(' ') || 'Hello 123';

publish({ msg });
