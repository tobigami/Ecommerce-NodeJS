'use strict';

const rdb = require('../dbs/init.redis.v2');

const MAX_TOKENS = 30; // Số token tối đa
const REFILL_RATE = 1; // Số token được thêm vào mỗi giây
const TTL = 60; // Khoảng thời gian tính bằng giây (1 phút)



const rateLimit = async (req, res, next) => {

	/**
	 * 1. Lấy userId và productId từ request
	 * 2. Nếu tồn tại thì lấy thông tin token hiện tại từ redis
	 * 5. Tính toán số token mới được thêm vào
	 * 6. Cập nhật số token và thời gian refill
	 * 7. Kiểm tra và sử dụng token
	 * 8. Nếu không còn token thì trả về lỗi
	 * 9. Nếu còn token thì trả về kết quả
	 */

	try {

		const redisIns = rdb.get();

		// 1. get userId and productId
		const userId = req.user?.id || req.ip;
		const productId = req.body.productId;
		
		if (!productId) {
			return res.status(400).json({
				status: 'error',
				message: 'Product ID is required'
			});
		}

		const key = `token:${userId}:${productId}`;
		
		const tokenInfo = await redisIns.get(key);
		const now = Date.now();
		
		let currentTokens, lastRefillTime;
		
		if (!tokenInfo) {
			// 3. init tokenInfo set max tokens
			currentTokens = MAX_TOKENS;
			lastRefillTime = now;
			await redisIns.set(key, JSON.stringify({
				tokens: currentTokens,
				lastRefill: lastRefillTime
			}));
		} else {
			// 2. Nếu tồn tại thì lấy thông tin token hiện tại từ redis
			const data = JSON.parse(tokenInfo);
			currentTokens = data.tokens;
			lastRefillTime = data.lastRefill;
			
			// Tính toán số token mới được thêm vào
			const timePassed = (now - lastRefillTime) / 1000; // Chuyển sang giây

			const newTokens = Math.floor(timePassed * REFILL_RATE);
			
			if (newTokens > 0) {
				// Cập nhật số token và thời gian refill
				currentTokens = Math.min(MAX_TOKENS, currentTokens + newTokens);
				lastRefillTime = now;
				
				await redisIns.set(key, JSON.stringify({
					tokens: currentTokens,
					lastRefill: lastRefillTime
				}));
			}
		}
		
		// Kiểm tra và sử dụng token
		if (currentTokens > 0) {
			// Giảm số token
			currentTokens--;
			await redisIns.set(key, JSON.stringify({
				tokens: currentTokens,
				lastRefill: lastRefillTime
			}));
			
			// Set thời gian hết hạn cho key
			await redisIns.expire(key, TTL);
			
			next();
		} else {
			// Tính thời gian còn lại để có token mới
			const timeToNextToken = Math.max(0, Math.ceil((1000 / REFILL_RATE) - (now - lastRefillTime)));
			
			return res.status(429).json({
				status: 'error',
				message: 'Too many clicks. Please try again later.',
				retryAfter: timeToNextToken
			});
		}
	} catch (error) {
		console.error('Rate limit error:', error);
		next(error);
	}
};

module.exports = {
	rateLimit,
};
