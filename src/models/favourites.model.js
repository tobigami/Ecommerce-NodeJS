'use strict';

const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../dbs/init.mysql');

class Favourites extends Model {}

Favourites.init(
	{
		id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.TEXT(),
			allowNull: false
		},
		author: {
			type: DataTypes.STRING(500),
			allowNull: false
		},
		view: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 0
		},
		download: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 0
		}
	},
	{
		sequelize,
		tableName: 'Favourites',
		timestamps: true,
		charset: 'utf8',
		collate: 'utf8_general_ci'
	}
);

module.exports = Favourites;
