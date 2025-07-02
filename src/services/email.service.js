const { BadRequestError } = require('../core/error.response');
const redisDb = require('../dbs/init.redis.v2');

const {
	getScheduleEmailById,
	getScheduleEmailCanSend,
	addScheduleEmailRepo,
} = require('../models/repositories/email.repo');

class EmailService {
	static async sendEmail(id) {
		try {
			const emailInfo = await getScheduleEmailCanSend(id);

			console.log('emailInfo :>> ', emailInfo);

			if (!emailInfo) {
				throw new BadRequestError('Email not found');
			}

			console.log(`[MOCK EMAIL SERVICE] Sending email:
				From: ${emailInfo.from_email}
				To: ${emailInfo.to_email}
				Subject: ${emailInfo.subject}
				Body: ${emailInfo.body}
				Status: Simulating email sending...
			`);

			const randomTime = Math.ceil(Math.random() * 1000);

			// Giả lập thời gian gửi email
			await new Promise((resolve) => setTimeout(resolve, randomTime));

			// Cập nhật trạng thái email thành 'sent'
			await emailInfo.update({ status: 'sent' });

			// Trả về thông tin email đã gửi
			return {
				success: true,
				emailInfo: emailInfo.toJSON(),
				sentAt: new Date(),
				message: 'Email sent successfully (simulated)',
			};
		} catch (error) {
			console.error('Email sending failed:', error);
			throw error;
		}
	}

	static async addScheduleEmail(emailData) {
		const redisIns = redisDb.get();

		const { from_email, to_email, subject, scheduled_time } = emailData;

		if (!from_email.trim() || !to_email.trim() || !subject.trim()) {
			throw new BadRequestError('Missing required fields');
		}

		if (isNaN(Date.parse(scheduled_time))) {
			throw new BadRequestError('Invalid schedule time format');
		}

		// Compare both dates in UTC
		if (new Date(scheduled_time) < new Date()) {
			throw new BadRequestError('Scheduled time must be in the future');
		}

		// Format the date for MySQL - convert ISO string to MySQL datetime format
		const formattedData = {
			...emailData,
			scheduled_time: new Date(scheduled_time).toISOString().slice(0, 19).replace('T', ' '),
		};

		return await addScheduleEmailRepo(formattedData);
	}
}

module.exports = EmailService;
