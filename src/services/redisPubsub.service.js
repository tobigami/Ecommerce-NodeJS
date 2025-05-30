'use strict';
const Redis = require('redis');

class RedisPubsubService {
	constructor() {
		const redisConfig = {
			host: process.env.REDIS_HOST || 'localhost',
			port: process.env.REDIS_PORT || 6379,
		};

		this.subscriber = Redis.createClient(redisConfig);
		this.publisher = Redis.createClient(redisConfig);
	}

	publish(channel, message) {
		return new Promise((resolve, reject) => {
			this.publisher.publish(channel, message, (err, reply) => {
				if (err) {
					reject(err);
				} else {
					resolve(reply);
				}
			});
		});
	}

	subscribe(channel, callback) {
		this.subscriber.subscribe(channel);
		this.subscriber.on('message', (subscriberChannel, message) => {
			if (channel === subscriberChannel) {
				callback(channel, message);
			}
		});
	}
}

module.exports = new RedisPubsubService();
