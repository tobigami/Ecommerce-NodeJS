'use strict';

const testModel = require('../models/test.model');
const commentModel = require('../models/comment.model');
const { convertToObjectIdMongodb } = require('../utils');
const {
	addFavouritesRepo,
	getFavouritesRepo,
	deleteFavouritesRepo
} = require('../models/repositories/favourites.repo');

class TestService {
	static async createTest({ name, old, gender, shop }) {
		const comment = await commentModel.findOne({
			comment_productId: convertToObjectIdMongodb(shop)
		});

		return {
			name: 'thanhdd',
			age: 20
		};
	}

	static async addFavourites({ name, author, view, download }) {
		console.log('Adding favourites with data: ', { name, author, view, download });
		return await addFavouritesRepo({ name, author, view, download });
	}

	static async getFavourites(query) {
		const { size, page, keyword, sort } = query;
		return await getFavouritesRepo({
			size: size || 10,
			page: page || 1,
			keyword: keyword || '',
			sort: sort || 'name,asc'
		});
	}

	static async bulkDeleteFavourites(ids) {
		return await deleteFavouritesRepo(ids);
	}
}

module.exports = TestService;
