'use strict';
const redis = require('redis');
const { REDIS_URL } = process.env;
const { RedisError } = require('../core/error.response');
const RECONNECT_TIME_OUT = 3 * 1000;

let client = {},
	statusConnectRedis = {
		CONNECT: 'connect', // trigger sau khi connect thanh cong
		END: 'end', // trigger khi ket noi bi ngat
		RECONNECT: 'reconnecting', // trigger khi redis co gang ket noi lai khi xay ra su kien END
		ERROR: 'error' // trigger khi co bat ky loi gi xay ra trong qua trinh connect
	},
	connectTimeout;

const handleConnectTimeout = () => {
	connectTimeout = setTimeout(() => {
		// throw new RedisError('Connect Redis DB FAIL');
		throw new BadRequestError(`Discount code has expire!`);
	}, RECONNECT_TIME_OUT);
};

const Logger = require('../log/discord.log');

const handleEventConnection = ({ connectionRedis }) => {
	// check is null ....
	connectionRedis.on(statusConnectRedis.CONNECT, () => {
		console.log(`\x1b[35m connectionRedis - Connection status:\x1b[32m connected`);
		clearTimeout(connectTimeout);
	});

	connectionRedis.on(statusConnectRedis.END, () => {
		console.log(`\x1b[35m connectionRedis - Connection status:\x1b[31m disconnected`);
		handleConnectTimeout();
	});

	connectionRedis.on(statusConnectRedis.RECONNECT, () => {
		console.log(`\x1b[35m connectionRedis - Connection status:\x1b[33m  reconnecting`);
		Logger.sendToFormatCode({
			title: `Method": Reconnect Redis DB`,
			code: 'Error',
			message: `Method": Reconnect Redis DB`
		});
		clearTimeout(connectTimeout);
	});

	connectionRedis.on(statusConnectRedis.ERROR, (err) => {
		console.log(`\x1b[35m connectionRedis - Connection status:\x1b[31m ${err}`);
	});
};

const initRedis = () => {
	const instanceRedis = redis.createClient({
		url: REDIS_URL
	});

	client.instanceRedis = instanceRedis;
	handleEventConnection({ connectionRedis: instanceRedis });
};

const getRedis = () => client;

const closeRedis = () => {
	//....
};

module.exports = {
	initRedis,
	getRedis,
	closeRedis
};
