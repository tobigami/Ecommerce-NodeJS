'use strict';

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';

const discountSchema = new Schema(
	{
		discount_name: { type: String, required: true },
		discount_description: { type: String, required: true },
		discount_shop_id: { type: Schema.Types.ObjectId, ref: 'Shop' },
		discount_type: { type: String, default: 'fixed_amount' }, // fix_amount || percentage
		discount_value: { type: Number, required: true }, // 10.000 || 80
		discount_code: { type: String, required: true }, // discount code
		discount_start_date: { type: Date, required: true },
		discount_end_date: { type: Date, required: true },
		discount_max_quantity: { type: Number, required: true }, // maximum quantity discount
		discount_uses_count: { type: Number, required: true }, // quantity discount was used
		discount_users_used: { type: Array, default: [] }, // who customer used this discount
		discount_max_uses_per_user: { type: Number, require: true }, // max quantity discount per user
		discount_min_order_value: { type: Number, required: true }, // min amount in order can use this discount

		discount_is_active: { type: Boolean, default: true }, // discount status enable || disable
		discount_applies_to: { type: String, required: true, enum: ['all', 'specific'] },
		discount_product_ids: { type: Array, default: [] }
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME
	}
);

module.exports = model(DOCUMENT_NAME, discountSchema);
