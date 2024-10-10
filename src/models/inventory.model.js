'use strict';

const { Schema, Types, model } = require('mongoose');

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

const inventorySchema = new Schema(
	{
		inven_productId: { type: Types.ObjectId, ref: 'Product' },
		inven_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
		inven_location: { type: String, default: 'unKnow' },
		inven_stock: { type: Number, required: true },
		inven_reservations: { type: Array, default: [] }
		/*
      cartId
      stock
      createOn
    */
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME
	}
);

module.exports = model(DOCUMENT_NAME, inventorySchema);
