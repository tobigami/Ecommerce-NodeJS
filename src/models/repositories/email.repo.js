'use strict';

// Import models from the centralized index file
const db = require('../mysql');
const ScheduledEmails = db.ScheduledEmails;
const { Op, QueryTypes } = require('sequelize');

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
		},
	});
};

const updateScheduleEmailRepo = async (id, updateData) => {
	const { from_email, to_email, subject, body, html_body, scheduled_time, status, cc, bcc } =
		updateData;

	// Build dynamic SET clause
	let setClause = [];
	let replacements = [];

	if (from_email !== undefined) {
		setClause.push('from_email = ?');
		replacements.push(from_email);
	}

	if (to_email !== undefined) {
		setClause.push('to_email = ?');
		replacements.push(to_email);
	}

	if (subject !== undefined) {
		setClause.push('subject = ?');
		replacements.push(subject);
	}

	if (body !== undefined) {
		setClause.push('body = ?');
		replacements.push(body);
	}

	if (html_body !== undefined) {
		setClause.push('html_body = ?');
		replacements.push(html_body);
	}

	if (scheduled_time !== undefined) {
		setClause.push('scheduled_time = ?');
		replacements.push(scheduled_time);
	}

	if (status !== undefined) {
		setClause.push('status = ?');
		replacements.push(status);
	}

	if (cc !== undefined) {
		setClause.push('cc = ?');
		replacements.push(cc);
	}

	if (bcc !== undefined) {
		setClause.push('bcc = ?');
		replacements.push(bcc);
	}

	// Add updatedAt
	setClause.push('updatedAt = NOW()');

	// Only proceed if there are fields to update
	if (setClause.length > 0) {
		await ScheduledEmails.sequelize.query(
			`UPDATE ScheduledEmails 
			 SET ${setClause.join(', ')}
			 WHERE id = ?`,
			{
				replacements: [...replacements, id],
				type: ScheduledEmails.sequelize.QueryTypes.UPDATE,
			},
		);
	}

	// Return the updated email
	return await getScheduleEmailById(id);
};

const getAllEmailSchedulesToReSchedule = async ({ offset = 0, limit = 10 }) => {
	console.log('offset', offset, 'limit', limit, typeof offset);

	const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

	// select * from ScheduledEmails where scheduled_time > '${oneDayAgo.slice(0, 19).replace('T', ' ')}' limit ${offset}, ${limit};

	const query = `
		select pre.id, pre.scheduled_time, status 
			from (select id, scheduled_time
				from ScheduledEmails
				where scheduled_time > '${oneDayAgo.slice(0, 19).replace('T', ' ')}'
				order by id
				limit ${offset}, ${limit}) as temp
					inner join ScheduledEmails as pre on temp.id = pre.id
		order by id;
	`;

	console.log('query ::', query);

	// 6s | 3000001 -> 3000010

	return await ScheduledEmails.sequelize.query(query, {
		type: QueryTypes.SELECT,
		raw: true,
	});

	// 13s | 3000001 -> 3000010
	return await ScheduledEmails.findAll({
		attributes: ['id', 'scheduled_time', 'status'],
		where: {
			scheduled_time: {
				[Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000),
			},
		},
		order: [['id', 'ASC']],
		offset: parseInt(offset, 10),
		limit: parseInt(limit, 10),
	});
};

module.exports = {
	getScheduleEmailById,
	getScheduleEmailCanSend,
	addScheduleEmailRepo,
	updateEmailStatusRepo,
	getAllEmailSchedulesRepo,
	updateScheduleEmailRepo,
	getAllEmailSchedulesToReSchedule,
};
