'use strict';

const MODEL_NAME = 'ScheduledEmails';
const TABLE_NAME = 'ScheduledEmails';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class EmailSchedule extends Model {
		static associate(models) {}
	}

	EmailSchedule.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			from_email: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: '',
			},
			to_email: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: '',
			},
			subject: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: '',
			},
			body: {
				type: DataTypes.STRING(3000),
				allowNull: false,
				defaultValue: '',
			},
			html_body: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: '',
			},
			scheduled_time: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: '',
			},
			status: {
				type: DataTypes.ENUM('pending', 'sent', 'failed'),
				allowNull: false,
				defaultValue: 'pending',
			},
			retry_count: {
				type: DataTypes.SMALLINT.UNSIGNED,
				allowNull: false,
				defaultValue: 0,
			},
			max_retries: {
				type: DataTypes.SMALLINT.UNSIGNED,
				allowNull: false,
				defaultValue: 3,
			},
			cc: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: '',
			},
			bcc: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: '',
			},
		},

		{
			sequelize,
			timestamps: true,
			tableName: TABLE_NAME,
			modelName: MODEL_NAME,
		},
	);
	return EmailSchedule;
};
