const app = require('./src/app');
const mongoose = require('mongoose');
const { PORT } = process.env;

const server = app.listen(PORT, () => {
	console.log(`\x1b[35m Server port: \x1b[32m${PORT}`);
});

process.on('SIGINT', () => {
	server.close(async () => {
		await mongoose.disconnect();
		console.log('\x1b[31m Server is close');
		process.exit(0);
	});
});
