'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('users', {
			user_id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			user_email: {
				type: Sequelize.STRING(30),
				allowNull: false,
				defaultValue: '',
			},
			user_phone: {
				type: Sequelize.STRING(15),
				allowNull: false,
				defaultValue: '',
			},
			user_username: {
				type: Sequelize.STRING(30),
				allowNull: false,
				defaultValue: '',
			},
			user_password: {
				type: Sequelize.STRING(32),
				allowNull: false,
				defaultValue: '',
			},
			user_status: {
				type: Sequelize.TINYINT,
				allowNull: false,
				defaultValue: 0,
			},
			user_createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			user_updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('users');
	},
};
