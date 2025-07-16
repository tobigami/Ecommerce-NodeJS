const { BadRequestError } = require('../core/error.response');
const EmailQueue = require('./email.queue.service');

const {
	getScheduleEmailCanSend,
	addScheduleEmailRepo,
	updateEmailStatusRepo,
	getScheduleEmailById,
	updateScheduleEmailRepo,
	getAllEmailSchedulesToReSchedule,
} = require('../models/repositories/email.repo');

class EmailService {
	static async sendEmail(id) {
		try {
			const emailId =
				typeof id === 'string' && id.startsWith('email-') ? parseInt(id.replace('email-', '')) : id;

			const emailInfo = await getScheduleEmailCanSend(emailId);

			if (!emailInfo) {
				throw new BadRequestError(`Email not found:: ${id}`);
			}

			console.log(`[MOCK EMAIL SERVICE] Sending email:
				--------------------------------------------
				Id: ${emailInfo.id}
				From: ${emailInfo.from_email}
				To: ${emailInfo.to_email}
				Status: Simulating email sending...
				--------------------------------------------
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
		try {
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

			// save to DB
			const savedEmail = await addScheduleEmailRepo({
				...emailData,
				scheduled_time: scheduled_time.slice(0, 19).replace('T', ' '),
			});

			// add job to email queue
			const queueResult = await EmailQueue.addEmailJob({
				emailId: savedEmail.id,
				scheduled_time: scheduled_time,
			});

			console.log(`Job scheduled with ID: ${queueResult.jobId} for email ID: ${savedEmail.id}`);

			// update job_id in the database
			await updateEmailStatusRepo({
				id: savedEmail.id,
				status: 'pending',
				jobId: queueResult.jobId,
			});

			return savedEmail;
		} catch (error) {
			console.error(`Failed to schedule email job: ${error.message}`);
			throw error;
		}
	}

	static async rescheduleEmails() {
		try {
			const emailsToSchedule = await getAllEmailSchedulesToReSchedule();
			const jobs = (await EmailQueue.getListJobsActive()).map((i) => i.id);

			const results = [];
			for (const email of emailsToSchedule) {
				try {
					if (jobs.includes(email.job_id)) {
						results.push({
							emailId: email.id,
							jobId: email.job_id,
							status: 'scheduled',
						});

						continue;
					}

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

	static async getListJob() {
		try {
			const jobs = await EmailQueue.getListJobsActive();

			return jobs.map((job) => ({
				id: job.id,
				data: job.data,
			}));
		} catch (error) {
			console.error('Failed to retrieve email jobs:', error);
			throw error;
		}
	}

	static async updateScheduleEmail(id, body) {
		try {
			const emailExit = await getScheduleEmailById(id);

			if (!emailExit) throw new BadRequestError(`Email schedule not found :: ${id}`);

			const updateData = {};
			// Check each possible field and only add it to updateData if it exists in body
			if (body.from_email != null) updateData.from_email = body.from_email;
			if (body.to_email != null) updateData.to_email = body.to_email;
			if (body.subject != null) updateData.subject = body.subject;
			if (body.body != null) updateData.body = body.body;
			if (body.html_body != null) updateData.html_body = body.html_body;

			// handle scheduled_time
			if (body.scheduled_time != null) {
				if (isNaN(Date.parse(body.scheduled_time))) {
					throw new BadRequestError('Invalid schedule time format');
				}

				// compare both dates in UTC
				if (new Date(body.scheduled_time) < new Date()) {
					throw new BadRequestError('Scheduled time must be in the future');
				}

				updateData.scheduled_time = body.scheduled_time.slice(0, 19).replace('T', ' ');

				if (emailExit.job_id) {
					await EmailQueue.removeJob(emailExit.job_id);
				}

				// update new job in queue
				const queueResult = await EmailQueue.addEmailJob({
					emailId: emailExit.id,
					scheduled_time: body.scheduled_time,
				});

				updateData.status = 'pending';
				updateData.job_id = queueResult.jobId;
			}

			if (Object.keys(updateData).length === 0) {
				return emailExit;
			}

			return await updateScheduleEmailRepo(id, updateData);
		} catch (error) {
			throw error;
		}
	}
}

module.exports = EmailService;
