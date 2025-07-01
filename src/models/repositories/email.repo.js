'use strict';

// Import models from the centralized index file
const db = require('../mysql');
const ScheduledEmails = db.ScheduledEmails;
const { Op } = require('sequelize');

const getScheduleEmailById = async (id) => {
	return await ScheduledEmails.findByPk(id);
};

const getScheduleEmailCanSend = async (id) => {
	return await ScheduledEmails.find({
		where: {
			id: id,
			status: {
				[Op.or]: ['pending', 'failed'],
			},
			retry_count: {
				[Op.lt]: db.ScheduledEmails.rawAttributes.max_retries.defaultValue,
			},
		},
	});
};

module.exports = { getScheduleEmailById, getScheduleEmailCanSend };
