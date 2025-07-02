const { Queue } = require('bullmq');
const redisDb = require('../dbs/init.redis.v2');
const { bullEmailConfig } = require('../configs/bull.config');

class EmailQueue {
	constructor() {
		this.queue = new Queue(bullEmailConfig.name, {
			connection: redisDb.get(),
			defaultJobOptions: {
				attempts: bullEmailConfig.attempt,
				backoff: bullEmailConfig.backoff,
				removeOnComplete: true,
				removeOnFail: false,
			},
		});
	}

	async addEmailJob({ emailId, scheduled_time }) {
		const delay = new Date(scheduled_time).getTime() - Date.now();

		const job = await this.queue.add(
			'sendEmail',
			{ emailId },
			{
				delay: delay > 0 ? delay : 0,
				jobId: emailId, // Use emailId as the job ID
			},
		);

		return {
			jobId: job.id,
			emailId,
			scheduled_time,
			status: 'scheduled',
		};
	}
}

module.exports = new EmailQueue();
