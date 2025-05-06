'use strict';

const crypto = require('crypto');
const apiKeyModel = require('../models/apiKey.model');

const findById = async (key) => {
	const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
	return objKey;
};

const createApiKey = async (req, res, next) => {
	const newKey = await apiKeyModel.create({
		key: crypto.randomBytes(10).toString('hex'),
		status: true,
		permissions: ['0000'],
	});
	console.log('newKey');

	return res.status(200).json({
		apiKey: newKey,
	});
};

module.exports = { findById, createApiKey };
