const { createReadStream } = require('fs');
const { createServer } = require('http');
const path = require('path');

const server = createServer();

server.on('request', (req, res) => {
	const filePath = path.join(__dirname, '../../uploads/video.mp4');
	const result = createReadStream(filePath);
	result.pipe(res);
});

server.listen(3000);
