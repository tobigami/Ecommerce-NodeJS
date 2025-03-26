'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			'ClickTracking',
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				userId: {
					type: Sequelize.INTEGER,
					allowNull: false,
				},
				productId: {
					type: Sequelize.INTEGER,
					allowNull: false,
				},
				count: {
					type: Sequelize.INTEGER.UNSIGNED,
					defaultValue: 0,
				},
				createdAt: {
					type: Sequelize.DATE,
					allowNull: false,
					defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
				},
				updatedAt: {
					type: Sequelize.DATE,
					allowNull: false,
					defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
				},
			},
			{
				charset: 'utf8',
				collate: 'utf8_general_ci',
			},
		);

		await queryInterface.addConstraint('ClickTracking', {
			fields: ['userId', 'productId'],
			type: 'unique',
			name: 'unique_user_product_tracking',
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('ClickTracking');
	},
};
