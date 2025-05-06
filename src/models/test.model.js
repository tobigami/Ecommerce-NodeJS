'use strict';

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Test';
const COLLECTION_NAME = 'Tests';

const testSchema = new Schema(
	{
		test_shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
		test_name: { type: String, default: 'text' },
		test_old: { type: Number, default: 10 },
		test_gender: { type: String, required: true, enum: ['male', 'female'] },
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	},
);

module.exports = model(DOCUMENT_NAME, testSchema);
