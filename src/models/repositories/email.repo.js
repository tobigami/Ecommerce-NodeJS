'use strict';

// Import models from the centralized index file
const db = require('../mysql');
const ScheduledEmails = db.ScheduledEmails;
const { Op } = require('sequelize');

const getScheduleEmailById = async (id) => {
	return await ScheduledEmails.findByPk(id);
};

const getScheduleEmailCanSend = async (id) => {
	return await ScheduledEmails.findOne({
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

const addScheduleEmailRepo = async (emailData) => {
	return await ScheduledEmails.create(emailData);
};

const updateEmailStatusRepo = async ({ id, status, jobId = null }) => {
	return await ScheduledEmails.update(
		{
			status,
			job_id: jobId,
			...(status === 'failed'
				? { retry_count: ScheduledEmails.sequelize.literal('retry_count + 1') }
				: {}),
		},
		{
			where: { id },
		},
	);
};

const getAllEmailSchedulesRepo = async () => {
	return await ScheduledEmails.findAll({
		where: {
			status: 'pending',
			job_id: null,
			scheduled_time: {
				[Op.gt]: new Date(),
			},
		},
	});
};

module.exports = {
	getScheduleEmailById,
	getScheduleEmailCanSend,
	addScheduleEmailRepo,
	updateEmailStatusRepo,
	getAllEmailSchedulesRepo,
};
