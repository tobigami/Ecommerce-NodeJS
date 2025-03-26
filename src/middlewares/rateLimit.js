'use strict';

const rdb = require('../dbs/init.redis.v2');

const rateLimit = async (req, res, next) => {
	console.log('req', req.path);
	const key = req.path;
	const redisIns = rdb.get();
	const currentReq = await redisIns.incr(key);
	if (currentReq === 1) {
		await redisIns.expire(key, 10);
	}
	console.log('Current-Req:', currentReq);
	next();
};

module.exports = {
	rateLimit,
};
