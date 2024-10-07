'use strict';

const { NotifyEnum } = require('../configs/enum');
const NotifyModel = require('../models/notification.model');

class NotificationService {
	static async PushToNotifySystem({
		type = NotifyEnum.SHOP_NEW_PRO,
		receiver = 1,
		sender = 1,
		options = {}
	}) {
		let content;

		// strategy design pattern
		if (type === NotifyEnum.SHOP_NEW_PRO) {
			content = `[[shop]] vua moi them 1 san pham [[product_name]]`;
		} else if (type === NotifyEnum.PROMOTION_NEW) {
			content = `[[shop]] vua moi them 1 voucher [[voucher_name]]`;
		}
		// .....
		const newNotify = await NotifyModel.create({
			notify_type: type,
			notify_senderID: sender,
			notify_receiverId: receiver,
			notify_content: content,
			notify_options: options
		});

		return newNotify;
	}

	static async GetListNotifyByUser({ userId = 1, type = 'ALL', isRead = 0 }) {
		const match = { notify_receiverId: parseInt(userId) };

		if (type !== 'ALL') {
			match['notify_type'] = type;
		}

		return await NotifyModel.aggregate([
			{ $match: match },
			{
				$project: {
					notify_type: 1,
					notify_senderID: 1,
					notify_receiverId: 1,
					notify_content: {
						$concat: [
							{
								$substr: ['$notify_options.shop_name', 0, -1]
							},
							' vua moi them 1 sp moi',
							{
								$substr: ['$notify_options.product_name', 0, -1]
							}
						]
					},
					notify_options: 1,
					createAt: 1
				}
			}
		]);
	}
}

module.exports = NotificationService;
