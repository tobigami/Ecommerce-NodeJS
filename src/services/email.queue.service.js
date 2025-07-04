const { Queue } = require('bullmq');
const redisDb = require('../dbs/init.redis.v2');
const { bullEmailConfig } = require('../configs/bull.config');

class EmailQueue {
	constructor() {
		// Đảm bảo rằng kết nối Redis đã được khởi tạo
		if (!redisDb.get()) {
			console.warn('Redis client not initialized. Initializing now...');
			redisDb.init();
		}

		this.queue = new Queue(bullEmailConfig.name, {
			connection: redisDb.get(),
			defaultJobOptions: {
				attempts: bullEmailConfig.attempt, // number of retry when job fails
				backoff: bullEmailConfig.backoff,
				removeOnComplete: true,
				removeOnFail: false,
			},
		});
	}

	async addEmailJob({ emailId, scheduled_time }) {
		const now = Date.now();
		const scheduleTimeMs = new Date(scheduled_time).getTime();
		const delay = Math.max(0, scheduleTimeMs - now);

		let recipientHash = '';

		// Tạo jobId với nhiều thông tin hơn
		const timestamp = Date.now().toString().substring(8); // Lấy 5 số cuối của timestamp
		const jobIdString = `email-jobs-${emailId}-${timestamp}`;

		console.log(
			`Scheduling email ${emailId} with delay: ${delay}ms (${delay / (1000 * 60)} minutes)`,
		);

		try {
			const existingJob = await this.queue.getJob(jobIdString);
			if (existingJob) {
				await existingJob.remove();
				console.log(`Removed existing job with ID ${jobIdString}`);
			}
		} catch (err) {
			console.log(`Error checking/removing job with ID ${jobIdString}: ${err.message}`);
		}

		const job = await this.queue.add(
			'sendEmail',
			{ emailId },
			{
				delay: delay,
				jobId: jobIdString,
				removeOnComplete: true,
			},
		);

		console.log(`Job created: ${job.id}, will process in ${delay}ms`);

		return {
			jobId: jobIdString,
			emailId,
			scheduled_time: new Date(scheduled_time),
			status: 'scheduled',
		};
	}

	async getListJobsActive() {
		try {
			const jobs = await this.queue.getJobs(['active', 'waiting', 'delayed']);
			return jobs.map((job) => ({
				id: job.id,
				data: job.data,
				timestamp: job.timestamp,
				delay: job.delay,
				attemptsMade: job.attemptsMade,
				failedReason: job.failedReason,
			}));
		} catch (error) {
			console.error('Error fetching active jobs:', error);
			throw error;
		}
	}
}

module.exports = new EmailQueue();
