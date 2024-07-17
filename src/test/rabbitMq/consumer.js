const amqplib = require('amqplib');
const { RABBIT_MQ_PASS } = process.env;

const runConsumer = async () => {
    try {
        const connection = await amqplib.connect(`amqp://guest:${RABBIT_MQ_PASS || 'guest'}@localhost`);
        const channel = await connection.createChannel();
        const queueName = 'test-topic';
        await channel.assertQueue(queueName, {
            durable: true
        });

        console.log('111111')

        channel.consume(
            queueName,
            (message) => {
                console.log('Receiver message:', message.content.toString());
            },
            {
                noAck: true // khong gui lai cac tin nhan da duoc xu ly roi
            }
        );
    } catch (error) {
        console.log(error);
    }
};
runConsumer().catch((err) => console.log(err));

module.exports = runConsumer

