const { AUTH_PRIVATE, AUTH_PUBLIC } = process.env;
const JWT = require('jsonwebtoken');
const asyncHandler = require('../helper/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
	API_KEY: 'x-api-key',
	CLIENT_ID: 'x-client-id',
	AUTHORIZATION: 'authorization',
	REFRESHTOKEN: 'refreshtoken'
};

const createTokenPair = async (payload) => {
	try {
		const accessToken = await JWT.sign(payload, AUTH_PRIVATE, {
			expiresIn: '2 days',
			algorithm: 'RS256'
		});

		const refreshToken = await JWT.sign(payload, AUTH_PRIVATE, {
			expiresIn: '7 days',
			algorithm: 'RS256'
		});

		return { accessToken, refreshToken };
	} catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
	/**
	 * 1. Check userID missing
	 * 2. Get accessToken
	 * 3. Verify Token
	 * 4. Check id in DB
	 * 5. Check keyStore with this useId
	 * 6. OK next()
	 */

	// 1. Check userID missing
	const userId = req.headers[HEADER.CLIENT_ID];
	if (!userId) throw new AuthFailureError('Invalid Request');

	// 2.
	const keyStore = await findByUserId(userId);
	if (!keyStore) throw new NotFoundError('Not found key store');

	// 3.
	if (req.headers[HEADER.REFRESHTOKEN]) {
		const refreshToken = req.headers[HEADER.REFRESHTOKEN];
		try {
			const decodeUser = JWT.verify(refreshToken, AUTH_PUBLIC);
			if (decodeUser.userId !== userId) throw new AuthFailureError('Invalid User Id');
			req.keyStore = keyStore;
			req.refreshToken = refreshToken;
			req.user = decodeUser;
			return next();
		} catch (error) {
			throw error;
		}
	}

	const accessToken = req.headers[HEADER.AUTHORIZATION];
	if (!accessToken) throw new AuthFailureError('Invalid Request');

	try {
		const decodeUser = JWT.verify(accessToken, AUTH_PUBLIC);
		if (decodeUser.userId !== userId) throw new AuthFailureError('Invalid User Id');
		req.keyStore = keyStore;
		req.user = decodeUser;
		return next();
	} catch (error) {
		throw error;
	}
});

const verifyJWT = async (token, keySecret) => {
	return JWT.verify(token, keySecret);
};

module.exports = {
	createTokenPair,
	authentication,
	verifyJWT
};
