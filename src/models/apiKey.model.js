'use strict';

const { Schema, Types, model } = require('mongoose');

const DOCUMENT_NAME = 'Apikey';
const COLLECTION_NAME = 'Apikeys';

const apiKeySchema = new Schema(
	{
		key: {
			type: String,
			required: true,
			unique: true,
		},
		status: {
			type: Boolean,
			default: true,
		},
		permissions: {
			type: [String],
			enum: ['0000', '1111', '2222'],
			required: true,
		},
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	},
);

module.exports = model(DOCUMENT_NAME, apiKeySchema);
