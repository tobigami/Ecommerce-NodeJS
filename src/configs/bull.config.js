const { attempt } = require('lodash');

const bullEmailConfig = {
	name: 'email-queue',
	limiter: {
		max: 50,
		duration: 1000 * 60,
	},
	attempt: 3,
	backoff: {
		type: 'exponential',
		delay: 1000 * 60,
	},
};

module.exports = { bullEmailConfig };
