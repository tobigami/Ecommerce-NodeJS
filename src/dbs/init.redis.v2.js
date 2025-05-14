'use strict';

const redis = require('ioredis');

class RedisDB {
	constructor() {
		this.instance = null;
		this.client = null;
	}

	async init(options = {}) {
		const defaultConfig = {
			host: 'localhost',
			port: '6379',
			reconnectOnError: (err) => {
				console.error('Redis reconnect on error', err);
				return true;
			},
			maxRetriesPerRequest: 5,
			enableReadyCheck: true,
		};

		const connectConfig = { ...defaultConfig, ...options };
		try {
			if (this.client) return this.client;

			this.client = new redis(connectConfig);

			this.client.on('connect', () => {
				console.log('\x1b[35m Connect Redis: \x1b[32msuccess');
			});

			this.client.on('error', (err) => {
				console.error('Redis connection error', err);
			});

			this.client.on('reconnecting', () => {
				console.log('Redis is reconnecting');
			});

			this.client.on('close', () => {
				console.warn('Redis connection closed');
			});

			return this.client;
		} catch (error) {
			throw error;
		}
	}

	get() {
		if (!this.client) {
			console.warn('Redis client not initialized. Call init() first.');
		}

		return this.client;
	}

	async close() {
		if (this.client) {
			await this.client.quit();
			this.client = null;
			console.info('Redis connection closed gracefully');
		}
	}
}

module.exports = new RedisDB();
