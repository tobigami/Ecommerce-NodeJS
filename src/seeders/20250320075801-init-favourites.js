'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const favourites = Array.from({ length: 30 }, (_, index) => ({
			name: `Favourite Item ${index + 1}`,
			author: `Author ${Math.floor(index / 3) + 1}`,
			view: Math.floor(Math.random() * 1000),
			download: Math.floor(Math.random() * 500),
			createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
			updatedAt: new Date()
		}));

		await queryInterface.bulkInsert('Favourites', favourites, {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Favourites', null, {});
	}
};
