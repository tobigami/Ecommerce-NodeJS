const amqplib = require('amqplib');

const message = 'hello, RabbitMQ for ThanhDD 12123';

const runProducer = async () => {
	try {
		const connection = await amqplib.connect('amqp://guest:guest@localhost');
		const channel = await connection.createChannel();
		const queueName = 'test-topic';
		await channel.assertQueue(queueName, {
			durable: true
		});

		// send message to consumer
		channel.sendToQueue(queueName, Buffer.from(message), {
			persistent: true
			//  TTL  time  to live
		});
		console.log('message send:', message);

		setTimeout(function () {
			connection.close();
			process.exit(0);
		}, 500);
	} catch (error) {
		console.log(error);
	}
};

runProducer().catch((err) => console.log(err));
