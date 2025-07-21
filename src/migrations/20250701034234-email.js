'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('ScheduledEmails', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			from_email: {
				allowNull: false,
				type: Sequelize.STRING(255),
				defaultValue: '',
			},
			to_email: {
				allowNull: false,
				type: Sequelize.STRING(255),
				defaultValue: '',
			},
			subject: {
				allowNull: false,
				type: Sequelize.STRING(255),
				defaultValue: '',
			},
			body: {
				allowNull: false,
				type: Sequelize.STRING(3000),
				defaultValue: '',
			},
			html_body: {
				allowNull: false,
				type: Sequelize.TEXT(),
				defaultValue: '',
			},
			scheduled_time: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.NOW,
			},
			status: {
				type: Sequelize.ENUM('pending', 'sent', 'failed'),
				allowNull: false,
				defaultValue: 'pending',
			},
			retry_count: {
				allowNull: false,
				type: Sequelize.SMALLINT.UNSIGNED,
				defaultValue: 0,
			},
			max_retries: {
				allowNull: false,
				type: Sequelize.SMALLINT.UNSIGNED,
				defaultValue: 3,
			},
			cc: {
				allowNull: false,
				type: Sequelize.STRING(255),
				defaultValue: '',
			},
			bcc: {
				allowNull: false,
				type: Sequelize.STRING(255),
				defaultValue: '',
			},
			job_id: {
				allowNull: true,
				type: Sequelize.STRING(255),
				defaultValue: null,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});

		await queryInterface.addIndex('ScheduledEmails', ['scheduled_time', 'status'], {
			name: 'idx_scheduled_time_status',
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.removeIndex('ScheduledEmails', 'idx_scheduled_time_status');
		await queryInterface.dropTable('ScheduledEmails');
	},
};
