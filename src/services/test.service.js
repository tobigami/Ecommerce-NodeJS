'use strict';

const testModel = require('../models/test.model');
const commentModel = require('../models/comment.model');
const rdb = require('../dbs/init.redis.v2');
const { convertToObjectIdMongodb } = require('../utils');
const {
	addFavouritesRepo,
	getFavouritesRepo,
	deleteFavouritesRepo,
} = require('../models/repositories/favourites.repo');

class TestService {
	static async createTest({ name, old, gender, shop }) {
		const comment = await commentModel.findOne({
			comment_productId: convertToObjectIdMongodb(shop),
		});

		return {
			name: 'thanhdd',
			age: 20,
		};
	}

	static async addFavourites({ name, author, view, download }) {
		console.log('Adding favourites with data: ', { name, author, view, download });
		return await addFavouritesRepo({ name, author, view, download });
	}

	static async getFavourites(query) {
		const { size = 1, page = 1, tableSearch = '', sort = 'name,asc' } = query;
		const cacheKey = `favorites:${size}:${page}:${sort}`;
		const redisIns = rdb.get();

		try {
			const cacheData = await redisIns.get(cacheKey);

			if (cacheData) {
				console.log('caching data');
				return JSON.parse(cacheData);
			}

			const res = await getFavouritesRepo({
				size,
				page,
				keyword: tableSearch,
				sort,
			});

			console.log('fetching data');

			redisIns.set(cacheKey, JSON.stringify(res), 'EX', 5);
			return res;
		} catch (error) {
			throw error;
		}

		// const check = await redisIns.get('name');

		// console.log('check :>> ', check);

		// return await getFavouritesRepo({
		// 	size,
		// 	page,
		// 	keyword: tableSearch,
		// 	sort,
		// });
	}

	static async bulkDeleteFavourites(ids) {
		return await deleteFavouritesRepo(ids);
	}

	// history
	static async getHistory(query) {
		const { size, page, tableSearch, sort } = query;
		return await getHistoryRepo({
			size: size || 10,
			page: page || 1,
			keyword: tableSearch || '',
			sort: sort || 'name,asc',
		});
	}

	static async bulkDeleteHistory(ids) {
		return await deleteHistoryRepo(ids);
	}
}

module.exports = TestService;
