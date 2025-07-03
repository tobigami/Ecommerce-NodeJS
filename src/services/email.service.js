const { BadRequestError } = require('../core/error.response');
const redisDb = require('../dbs/init.redis.v2');
const EmailQueue = require('./email.queue.service');

const {
	getScheduleEmailById,
	getScheduleEmailCanSend,
	addScheduleEmailRepo,
	updateEmailStatusRepo,
	getAllEmailSchedulesRepo,
} = require('../models/repositories/email.repo');

class EmailService {
	static async sendEmail(id) {
		try {
			// Đảm bảo id là số nguyên (nếu được truyền vào dưới dạng chuỗi có tiền tố)
			const emailId =
				typeof id === 'string' && id.startsWith('email-') ? parseInt(id.replace('email-', '')) : id;

			const emailInfo = await getScheduleEmailCanSend(emailId);

			if (!emailInfo) {
				throw new BadRequestError('Email not found');
			}

			console.log(`[MOCK EMAIL SERVICE] Sending email:
				From: ${emailInfo.from_email}
				To: ${emailInfo.to_email}
				Status: Simulating email sending...
			`);

			const randomTime = Math.ceil(Math.random() * 1000);

			// Giả lập thời gian gửi email
			await new Promise((resolve) => setTimeout(resolve, randomTime));

			// Cập nhật trạng thái email thành 'sent'
			await updateEmailStatusRepo({ id: emailInfo.id, status: 'sent', jobId: emailInfo.job_id });

			// Trả về thông tin email đã gửi
			return {
				success: true,
				emailInfo: emailInfo.toJSON(),
				sentAt: new Date(),
				message: 'Email sent successfully (simulated)',
			};
		} catch (error) {
			console.error('Email sending failed:', error);
			if (id) {
				await updateEmailStatusRepo({ id: id, status: 'failed' });
			}
			throw error;
		}
	}

	static async addScheduleEmail(emailData) {
		// Khởi tạo dữ liệu email
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

		// Kiểm tra Redis connection trước khi thực hiện
		if (!redisDb.get()) {
			console.warn('Redis client not initialized. Initializing now...');
			await redisDb.init();
		}

		// save schedule email to database
		const savedEmail = await addScheduleEmailRepo(formattedData);

		try {
			// Chuyển đổi scheduled_time từ định dạng MySQL sang đối tượng Date trước khi gửi vào queue
			const scheduledDate = new Date(scheduled_time);

			// add job to email queue - với delay rõ ràng - sử dụng đối tượng Date thay vì chuỗi MySQL
			const queueResult = await EmailQueue.addEmailJob({
				emailId: savedEmail.id,
				scheduled_time: scheduledDate,
			});

			console.log(`Job scheduled with ID: ${queueResult.jobId} for email ID: ${savedEmail.id}`);

			// update job_id in the database
			await updateEmailStatusRepo({
				id: savedEmail.id,
				status: 'pending',
				jobId: queueResult.jobId,
			});

			// Ghi log để debug
			await getScheduleEmailById(savedEmail.id);
			return savedEmail;
		} catch (error) {
			console.error(`Failed to schedule email job: ${error.message}`);
			throw error;
		}
	}

	static async rescheduleEmails() {
		try {
			const emailsToSchedule = await getAllEmailSchedulesRepo();

			const results = [];
			for (const email of emailsToSchedule) {
				try {
					const queueResult = await EmailQueue.addEmailJob({
						emailId: email.id,
						scheduled_time: email.scheduled_time,
					});
					await updateEmailStatusRepo({
						id: email.id,
						status: 'pending',
						jobId: queueResult.jobId,
					});

					results.push({
						emailId: email.id,
						jobId: queueResult.jobId,
						status: 'scheduled',
					});
				} catch (err) {
					console.error(`Failed to schedule email ${email.id}:`, err);
					results.push({
						emailId: email.id,
						status: 'failed',
						error: err.message,
					});
				}
			}

			return {
				total: emailsToSchedule.length,
				scheduled: results.filter((r) => r.status === 'scheduled').length,
				failed: results.filter((r) => r.status === 'failed').length,
				details: results,
			};
		} catch (error) {
			console.error('Failed to reschedule emails:', error);
			throw error;
		}
	}
}

module.exports = EmailService;
