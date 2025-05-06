'use strict';

const keyTokenModel = require('../models/keyToken.model');
const {
	Types: { ObjectId },
} = require('mongoose');

class KeyTokenService {
	static createKeyToken = async ({ userId, refreshToken }) => {
		try {
			const filter = { user: userId },
				update = {
					refreshTokenUsed: [],
					refreshToken,
				},
				options = {
					upsert: true, //Neu khong tim duoc se insert
					new: true, // return ve document update thay vi document original
				};

			return await keyTokenModel.findOneAndUpdate(filter, update, options);
		} catch (error) {
			return error;
		}
	};

	static findByUserId = async (userId) => {
		return await keyTokenModel.findOne({ user: new ObjectId(userId) });
	};

	static removeKeyById = async (id) => {
		return await keyTokenModel.deleteOne({ _id: new ObjectId(id) });
	};

	static findByRefreshTokenUsed = async (refreshToken) => {
		return await keyTokenModel.findOne({ refreshTokenUsed: refreshToken }).lean();
	};

	static findByRefreshToken = async (refreshToken) => {
		return await keyTokenModel.findOne({ refreshToken });
	};

	static findByIdAndDelete = async (userId) => {
		return await keyTokenModel.deleteOne({ user: new ObjectId(userId) });
	};
}

module.exports = KeyTokenService;
