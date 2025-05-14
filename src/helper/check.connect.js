const os = require('os');
const process = require('process');

const mongoose = require('mongoose');

const _SECONDS = 5000;
// count Connect
const countConnect = () => {
	const numConnection = mongoose.connections.length;
	console.log(`\x1b[35m numConnection: \x1b[32m${numConnection}`);
};

// check OverLoad
const checkOverload = () => {
	setInterval(() => {
		const numConnection = mongoose.connections.length;
		const numCores = os.cpus().length;
		const memoryUsage = process.memoryUsage().rss;

		console.log('Active Connection :>> ', numConnection);
		console.log(`Ram: ${memoryUsage / 1024 / 1024} MB`);

		// Example maximum number of connections on base num Core = 5
		const maximumConnect = numCores * 5;

		if (numConnection > maximumConnect) {
			console.log('Connection overload detected!');
		}
	}, _SECONDS); // Monitor every 5 second
};

module.exports = {
	countConnect,
	checkOverload,
};
