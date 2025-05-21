'use strict';

const { Schema, model } = require('mongoose');
const COLLECTION_NAME = 'TarotFeedbacks';
const DOCUMENT_NAME = 'TarotFeedbacks';

const cartSchema = new Schema(
	{
		name: { type: String, required: true, default: '' },
		age: { type: Number, required: true, default: 0 },
		content: { type: String, default: '' },
	},
	{
		collection: COLLECTION_NAME,
		timestamps: true,
	},
);

module.exports = model(DOCUMENT_NAME, cartSchema);
