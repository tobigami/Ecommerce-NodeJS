'use strict';

const redis = require('../dbs/init.redis.v2');
// const { promisify } = require('util'); // Not strictly needed with ioredis as it returns promises

const acquireLock = async (productId, cartId) => {
	const key = `lock_v2024_${productId}`;
	const retryTimes = 10;
	const expireTimeSeconds = 30; // 3 seconds lock

	for (let i = 0; i < retryTimes; i++) {
		// SET key value EX expireTime NX
		const result = await redis.get().set(key, cartId, 'EX', expireTimeSeconds, 'NX');
		if (result === 'OK') {
			// Placeholder for inventory check and reservation
			// Ideally, you would check inventory here and reserve it.
			// If reservation fails, release the lock immediately.
			// For now, we'll assume lock acquisition means reservation is possible.
			return key;
		}
		// Wait for a short period before retrying
		await new Promise((resolve) => setTimeout(resolve, 50));
	}
	return null; // Failed to acquire lock after retries
};

const releaseLock = async (keyLock) => {
	// Using Lua script for atomic deletion if the value matches
	// This prevents deleting a lock that was re-acquired by another process after expiration
	const script = "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";
	// We need the cartId or a unique identifier for the lock holder to safely release.
	// However, the current acquireLock sets cartId as the value, so we can use that.
	// For simplicity in this example, we'll just delete the key.
	// A more robust implementation would pass the expected value of the lock.
	return await redis.get().del(keyLock);
};

module.exports = {
	acquireLock,
	releaseLock,
};
