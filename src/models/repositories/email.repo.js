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

// using raw query to insert email schedule
const addScheduleEmailRepo = async (emailData) => {
	const {
		from_email,
		to_email,
		subject,
		body = '',
		html_body = '',
		scheduled_time,
		status = 'pending',
		cc = '',
		bcc = '',
	} = emailData;

	// Đầu tiên, thiết lập timezone là UTC
	// await ScheduledEmails.sequelize.query(`SET time_zone = '+00:00'`);

	// Sau đó thực hiện truy vấn chèn, sử dụng default values của schema
	const [result] = await ScheduledEmails.sequelize.query(
		`INSERT INTO ScheduledEmails 
		 (from_email, to_email, subject, body, html_body, scheduled_time, status, 
		  cc, bcc, createdAt, updatedAt) 
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
		{
			replacements: [
				from_email,
				to_email,
				subject,
				body,
				html_body,
				scheduled_time,
				status,
				cc,
				bcc,
			],
			type: ScheduledEmails.sequelize.QueryTypes.INSERT,
		},
	);

	const insertId = result;
	return await getScheduleEmailById(insertId);
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
