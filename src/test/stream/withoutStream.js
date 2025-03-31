const { createReadStream, readFileSync } = require('fs');
const { createServer } = require('http');
const path = require('path');

const server = createServer();

server.on('request', (req, res) => {
	const filePath = path.join(__dirname, '../../uploads/video.mp4');
	res.end(readFileSync(filePath));
});

console.log(process.pid);

server.listen(3000);
