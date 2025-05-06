setTimeout(() => {
	console.log('start'),
		Promise.resolve().then(() => {
			console.log('Promise');
		});

	process.nextTick(() => {
		console.log('nextTick');
	});
}, 0);
