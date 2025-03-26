'use strict';

const { Op } = require('sequelize');
const ClickTrackingModel = require('../mysql').ClickTracking;

const addClickTrackingRepo = async ({ productId, userId }) => {
	try {
		const existingRecord = await ClickTrackingModel.findOne({
			where: {
				userId: {
					[Op.eq]: userId,
				},
				productId: {
					[Op.eq]: productId,
				},
			},
			raw: true,
		});

		if (existingRecord) {
			return await ClickTrackingModel.update({ count: existingRecord.count + 1 }, { where: { id: existingRecord.id } });
		}

		return await ClickTrackingModel.create({
			userId,
			productId,
			count: 1,
		});
	} catch (error) {
		throw error;
	}
};

module.exports = {
	addClickTrackingRepo,
};
