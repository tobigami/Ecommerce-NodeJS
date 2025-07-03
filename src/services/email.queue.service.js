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
				attempts: bullEmailConfig.attempt,
				backoff: bullEmailConfig.backoff,
				removeOnComplete: true,
				removeOnFail: false,
			},
		});
	}

	async addEmailJob({ emailId, scheduled_time }) {
		// Đảm bảo định dạng thời gian chính xác
		let scheduledTime;

		// Kiểm tra xem scheduled_time là chuỗi MySQL hay đối tượng Date
		if (typeof scheduled_time === 'string') {
			// Nếu là chuỗi MySQL datetime (yyyy-MM-dd HH:mm:ss), cần xử lý đặc biệt
			if (scheduled_time.includes(' ')) {
				// Chuyển định dạng MySQL datetime sang định dạng ISO
				scheduledTime = new Date(scheduled_time.replace(' ', 'T') + 'Z');
				console.log(
					'Converted MySQL datetime format to Date:',
					scheduled_time,
					'->',
					scheduledTime,
				);
			} else {
				scheduledTime = new Date(scheduled_time);
			}
		} else {
			scheduledTime = scheduled_time;
		}

		// Tính toán delay chính xác (thời gian từ bây giờ đến scheduled_time)
		const now = Date.now();
		const scheduleTimeMs = scheduledTime.getTime();
		const delay = Math.max(0, scheduleTimeMs - now);

		console.log('Original scheduled_time:', scheduled_time);
		console.log('Converted scheduledTime:', scheduledTime);
		console.log('delay value:', delay);

		console.log(
			`Scheduling email ${emailId} with delay: ${delay}ms (${delay / (1000 * 60)} minutes)`,
		);
		console.log(`Scheduled time: ${scheduledTime}, Current time: ${new Date(now)}`);

		// Thêm tiền tố 'email-' vào ID để đảm bảo nó không phải là số nguyên
		const jobIdString = `email-${emailId}`;

		// Xóa job cũ với cùng ID nếu có
		try {
			// Kiểm tra xem job với ID này có tồn tại không
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
				jobId: jobIdString, // Use prefixed emailId as job ID
				removeOnComplete: true,
			},
		);

		console.log(`Job created: ${job.id}, will process in ${delay}ms`);

		return {
			jobId: jobIdString, // Trả về đúng ID chúng ta đã đặt (với tiền tố)
			emailId,
			scheduled_time: scheduledTime,
			status: 'scheduled',
		};
	}
}

module.exports = new EmailQueue();
