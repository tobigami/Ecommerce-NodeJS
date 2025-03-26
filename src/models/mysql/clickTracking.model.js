'use strict';

const MODEL_NAME = 'ClickTracking';
const TABLE_NAME = 'ClickTracking';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class ClickTracking extends Model {
		static associate(models) {
			// define associations here if needed
		}
	}

	ClickTracking.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			productId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			count: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
		},
		{
			sequelize,
			modelName: MODEL_NAME,
			tableName: TABLE_NAME,
			timestamps: true,
		},
	);

	return ClickTracking;
};
