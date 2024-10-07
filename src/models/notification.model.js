'use strict';

const { Schema, model } = require('mongoose');
const { NotifyEnum } = require('../configs/enum');

const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications';

const notificationSchema = new Schema(
	{
		notify_type: {
			type: String,
			required: true,
			enum: [
				NotifyEnum.SHOP_NEW_PRO,
				NotifyEnum.ORDER_FAILED,
				NotifyEnum.ORDER_SUCCESS,
				NotifyEnum.PROMOTION_NEW
			]
		},
		notify_senderID: { type: Schema.Types.ObjectId, ref: 'Shop' },
		notify_receiverId: { type: Number, required: true },
		notify_content: { type: String, required: true },
		notify_options: { type: Object, default: {} }
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME
	}
);

module.exports = model(DOCUMENT_NAME, notificationSchema);
