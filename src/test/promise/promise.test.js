const promise1 = new Promise((resolve) => setTimeout(() => resolve('success promise 1'), 500));
const promise2 = new Promise((_, reject) => setTimeout(() => reject('fail promise 2'), 200));
const promise3 = new Promise((resolve) => setTimeout(() => resolve('success promise 3'), 300));

console.log('-----Promise.all-----');
Promise.all([promise1, promise2, promise3])
	.then((values) => console.log(values))
	.catch((err) => console.error('loi', err));

console.log('-----Promise.allSettled-----');
Promise.allSettled([promise1, promise2, promise3])
	.then((values) => console.log(values))
	.catch((e) => console.log(e));

console.log('-----Promise.race-----');
Promise.race([promise1, promise2, promise3])
	.then((values) => console.log(values))
	.catch((e) => console.log(e));

console.log('-----Promise.any-----');
Promise.any([promise1, promise2, promise3])
	.then((values) => console.log(values))
	.catch((e) => console.log(e));
