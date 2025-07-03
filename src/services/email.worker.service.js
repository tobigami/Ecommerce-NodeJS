'use strict';

const { Worker } = require('bullmq');
const { bullEmailConfig } = require('../configs/bull.config');
const EmailService = require('../services/email.service');
const redisDb = require('../dbs/init.redis.v2');

class EmailWorker {
	constructor() {
		// Đảm bảo rằng kết nối Redis đã được khởi tạo
		if (!redisDb.get()) {
			console.warn('Redis client not initialized. Initializing now...');
			redisDb.init();
		}

		this.worker = new Worker(
			bullEmailConfig.name,
			async (job) => {
				try {
					console.log(`Processing email job: ${job.id}, data:`, job.data);
					const result = await EmailService.sendEmail(job.data.emailId);
					console.log(`Email job completed: ${job.id}`);
					return result;
				} catch (error) {
					console.error(`Error processing job ${job.id}:`, error);
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

		// Lập lịch lại các email chưa gửi khi khởi động ứng dụng
		this.rescheduleEmails();
	}

	async rescheduleEmails() {
		try {
			console.log('Rescheduling pending emails on startup...');
			const result = await EmailService.rescheduleEmails();
			console.log('Email rescheduling completed:', result);
		} catch (error) {
			console.error('Failed to reschedule emails on startup:', error);
		}
	}
}

module.exports = new EmailWorker();
