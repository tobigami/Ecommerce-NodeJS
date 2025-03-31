// This creates a timer and adds the callback function to the callback queue (macrotask queue)
// when the timer expires (even with 0ms, it will execute after the current execution context is complete)
setTimeout(function () {
	console.log(1); // This logs 1 (executed last)
});

// The Promise constructor executes synchronously
new Promise((resolve) => {
	console.log(2); // This logs 2 (executed immediately, synchronously)
	resolve(3); // This resolves the promise and schedules the .then callback
	// to be added to the microtask queue
}).then((val) => {
	// This is added to the microtask queue, which is processed after the current
	// execution context but before processing the callback queue
	console.log(val); // This logs 3 (executed third, after synchronous code but before setTimeout)
});

// This executes synchronously
console.log(4); // This logs 4 (executed second, right after the synchronous console.log(2))

// Execution order:
// 1. Synchronous code: console.log(2), console.log(4)
// 2. Microtask queue: Promise.then callback - console.log(3)
// 3. Callback queue (macrotask queue): setTimeout callback - console.log(1)
