'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const now = new Date();
		const scheduledEmail = Array.from({ length: 10000 }, (_, i) => ({
			from_email: `sender${i + 1}@example.com`,
			to_email: `recipient${i + 1}@example.com`,
			subject: `Test Subject ${i + 1}`,
			body: `This is the plain text body for email ${i + 1}.`,
			html_body: `<p>This is the <b>HTML</b> body for email ${i + 1}.</p>`,
			scheduled_time: new Date(
				now.getTime() +
					Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000 + // Ngày ngẫu nhiên (0-29 ngày)
					Math.floor(Math.random() * 24) * 60 * 60 * 1000 + // Giờ ngẫu nhiên (0-23 giờ)
					Math.floor(Math.random() * 60) * 60 * 1000 + // Phút ngẫu nhiên (0-59 phút)
					Math.floor(Math.random() * 60) * 1000, // Giây ngẫu nhiên (0-59 giây)
			),
			status: 'pending',
			retry_count: 0,
			max_retries: 3,
			cc: `cc${i + 1}@example.com`,
			bcc: `bcc${i + 1}@example.com`,
			createdAt: now,
			updatedAt: now,
		}));

		await queryInterface.bulkInsert('ScheduledEmails', scheduledEmail, {});
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */

		await queryInterface.bulkDelete('ScheduledEmails', null, {});
	},
};
