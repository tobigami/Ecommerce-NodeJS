'use strict';
const { Op } = require('sequelize');
const favouritesModel = require('../mysql/favourites.model');

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
							[Op.like]: `%${keyword}%`,
						},
					},
					{
						author: {
							[Op.like]: `%${keyword}%`,
						},
					},
				],
			}),
		},
	});

	const data = await favouritesModel.findAll({
		where: {
			...(keyword.trim() && {
				[Op.or]: [
					{
						name: {
							[Op.like]: `%${keyword}%`,
						},
					},
					{
						author: {
							[Op.like]: `%${keyword}%`,
						},
					},
				],
			}),
		},
		order: [[sortBy, order]],
		limit: Number(size),
		offset: offset,
	});

	hasNextPage = page * size < totalRecord;

	return {
		data,
		hasNextPage,
		currentPage: page,
		hasPrevPage: offset > 0,
		totalRecord: totalRecord,
		totalPage: Math.ceil(totalRecord / size),
	};
};

module.exports = { getFavouritesRepo };
