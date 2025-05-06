'use strict';

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const { createKeyToken } = require('./keyToken.service');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response');
const { findByEmail } = require('./shop.service');
const KeyTokenService = require('./keyToken.service');

const RoleShop = {
	SHOP: 'SHOP',
	WRITER: 'WRITER',
	EDITOR: 'EDITOR',
	ADMIN: 'ADMIN',
};

class AccessService {
	static handlerRefreshToken = async ({ refreshToken, user, keyStore }) => {
		const { userId, email } = user;

		if (keyStore.refreshTokenUsed.includes(refreshToken)) {
			await KeyTokenService.removeKeyById(userId);
			throw new ForbiddenError('Something is wrong~ please Login again');
		}

		if (refreshToken !== keyStore.refreshToken) {
			throw new AuthFailureError('Shop is not registered');
		}

		// check userId
		const foundShop = await findByEmail({ email });
		if (!foundShop) throw new AuthFailureError('Shop is not registered');

		// create new token
		const tokens = await createTokenPair({ userId, email });

		// update token
		await keyStore.updateOne({
			$set: {
				refreshToken: tokens.refreshToken,
			},
			$addToSet: {
				refreshTokenUsed: refreshToken,
			},
		});

		return {
			user,
			tokens,
		};
	};

	static logout = async ({ keyStore }) => {
		const delKey = await KeyTokenService.removeKeyById(keyStore._id);
		return delKey;
	};

	static login = async ({ email, password, refreshToken = null }) => {
		/**
		 * 1. Check email in db
		 * 2. Match Password
		 * 3. Create and Save AT, RT
		 * 4. Return data login
		 */

		//1. Check email
		const foundShop = await findByEmail({ email });
		if (!foundShop) throw new BadRequestError('Shop not registered');

		//2. Match password
		const match = await bcrypt.compare(password, foundShop.password);
		if (!match) throw new AuthFailureError('Authentication Error');

		//3. Create AT, RT
		const tokens = await createTokenPair({ userId: foundShop._id, email });

		await KeyTokenService.createKeyToken({
			refreshToken: tokens.refreshToken,
			userId: foundShop._id,
		});

		// 4. Return data login
		return {
			metadata: getInfoData({
				fields: ['_id', 'name', 'email'],
				object: foundShop,
			}),
			tokens,
		};
	};

	static signUp = async ({ name, email, password }) => {
		// step 1: check email exists?
		const holderShop = await shopModel.findOne({ email }).lean();
		if (holderShop) {
			throw new BadRequestError('Error: Email already register');
		}

		const passwordHash = await bcrypt.hash(password, 10);
		const newShop = await shopModel.create({
			name,
			email,
			password: passwordHash,
			roles: [RoleShop.SHOP],
		});

		if (newShop) {
			// Save collection keyStore
			await createKeyToken({
				userId: newShop._id,
			});

			// create token pair
			const tokens = await createTokenPair({ userId: newShop._id, email });

			return {
				code: 201,
				metadata: {
					shop: getInfoData({
						fields: ['_id', 'name', 'email'],
						object: newShop,
					}),
					tokens,
				},
			};
		}

		return {
			code: 200,
			metadata: null,
		};
	};
}

module.exports = AccessService;
