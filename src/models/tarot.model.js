'use strict';

const { Schema, model } = require('mongoose');
const COLLECTION_NAME = 'Tarots';
const DOCUMENT_NAME = 'Tarots';

const cartSchema = new Schema(
	{
		name: { type: String, required: true, default: '' },
		question: { type: String, required: true, default: '' },
		age: { type: Number, required: true, default: 0 },
		ip: { type: String, required: true, default: '' },
		isDev: { type: Boolean, default: false },
	},
	{
		collection: COLLECTION_NAME,
		timestamps: true,
	},
);

module.exports = model(DOCUMENT_NAME, cartSchema);
