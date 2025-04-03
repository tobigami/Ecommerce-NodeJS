'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			'Favourites',
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				name: {
					type: Sequelize.TEXT,
					allowNull: false,
				},
				author: {
					type: Sequelize.STRING(500),
					allowNull: false,
				},
				view: {
					type: Sequelize.INTEGER,
					defaultValue: 0,
				},
				download: {
					allowNull: false,
					type: Sequelize.INTEGER,
					defaultValue: 0,
				},
				createdAt: {
					type: Sequelize.DATE,
				},
				updatedAt: {
					type: Sequelize.DATE,
				},
			},
			{
				charset: 'utf8',
				collate: 'utf8_general_ci',
			},
		);
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Favourites');
	},
};
