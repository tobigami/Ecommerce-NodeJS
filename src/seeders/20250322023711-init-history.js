'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const history = Array.from({ length: 300 }, (_, index) => ({
			name: `History Item ${index + 1}`,
			author: `Author ${Math.floor(index / 3) + 1}`,
			view: Math.floor(Math.random() * 1000),
			download: Math.floor(Math.random() * 500),
			isFavorite: Math.random() >= 0.5,
			createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
			updatedAt: new Date()
		}));

		await queryInterface.bulkInsert('History', history, {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('History', null, {});
	}
};
