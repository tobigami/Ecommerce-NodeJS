'use strict';
const { Op } = require('sequelize');
const favouritesModel = require('../favourites.model');
const historyModel = require('../history.model');

const addFavouritesRepo = async ({ name, author, view, download }) => {
	return await favouritesModel.create({ name, author, view, download });
};

const getFavouritesRepo = async ({ size, page, keyword, sort }) => {
	let hasNextPage = false;
	const offset = (Number(page) - 1) * Number(size);

	const sortArr = sort.split(',');
	const [sortBy, order] = [...sortArr];

	const totalRecord = await favouritesModel.count({
		where: {
			...(keyword.trim() && {
				[Op.or]: [
					{
						name: {
							[Op.like]: `%${keyword}%`
						}
					},
					{
						author: {
							[Op.like]: `%${keyword}%`
						}
					}
				]
			})
		}
	});

	const data = await favouritesModel.findAll({
		where: {
			...(keyword.trim() && {
				[Op.or]: [
					{
						name: {
							[Op.like]: `%${keyword}%`
						}
					},
					{
						author: {
							[Op.like]: `%${keyword}%`
						}
					}
				]
			})
		},
		order: [[sortBy, order]],
		limit: Number(size),
		offset: offset
	});

	hasNextPage = page * size < totalRecord;

	return {
		data,
		hasNextPage,
		currentPage: page,
		hasPrevPage: offset > 0,
		totalRecord: totalRecord,
		totalPage: Math.ceil(totalRecord / size)
	};
};

const deleteFavouritesRepo = async (ids) => {
	return await favouritesModel.destroy({
		where: {
			id: {
				[Op.in]: ids
			}
		}
	});
};

const getHistoryRepo = async ({ size, page, keyword, sort }) => {
	let hasNextPage = false;
	const offset = (Number(page) - 1) * Number(size);
	const sortArr = sort.split(',');
	const [sortBy, order] = [...sortArr];

	const totalRecord = await historyModel.count({
		where: {
			...(keyword.trim() && {
				[Op.or]: [
					{
						name: {
							[Op.like]: `%${keyword}%`
						}
					},
					{
						author: {
							[Op.like]: `%${keyword}%`
						}
					}
				]
			})
		}
	});

	const data = await historyModel.findAll({
		where: {
			...(keyword.trim() && {
				[Op.or]: [
					{
						name: {
							[Op.like]: `%${keyword}%`
						}
					},
					{
						author: {
							[Op.like]: `%${keyword}%`
						}
					}
				]
			})
		},
		order: [[sortBy, order]],
		limit: Number(size),
		offset: offset
	});

	hasNextPage = page * size < totalRecord;

	return {
		data,
		hasNextPage,
		currentPage: page,
		hasPrevPage: offset > 0,
		totalRecord: totalRecord,
		totalPage: Math.ceil(totalRecord / size)
	};
};

const deleteHistoryRepo = async (ids) => {
	return await historyModel.destroy({
		where: {
			id: {
				[Op.in]: ids
			}
		}
	});
};

module.exports = { addFavouritesRepo, getFavouritesRepo, deleteFavouritesRepo, getHistoryRepo, deleteHistoryRepo };
