'use strict';

const { Worker } = require('bullmq');
const bullEmailConfig = require('../configs/bull.config');
const EmailService = require('../services/email.service');
const redisDb = require('../dbs/init.redis.v2');

class EmailWorker {
	constructor() {
		this.worker = new Worker(
			bullEmailConfig.name,
			async (job) => {
				try {
					const result = await EmailService.sendEmail(job.data.emailId);
					console.log(`Email job completed: ${job.id}`, result);
					return result;
				} catch (error) {
					throw error;
				}
			},
			{
				connection: redisDb.get(),
				limiter: bullEmailConfig.limiter,
				concurrency: 5, // Số lượng job có thể xử lý song song
			},
		);

		this.worker.on('completed', (job) => {
			console.log(`Email job ${job.id} has been completed successfully`);
		});

		this.worker.on('failed', (job, error) => {
			console.error(`Email job ${job.id} has failed:`, error);
		});
	}
}

module.exports = new EmailWorker();
