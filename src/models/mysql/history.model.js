'use strict';
const { Model } = require('sequelize');

const MODEL_NAME = 'History';
const TABLE_NAME = 'History';

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	User.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: '',
			},
			author: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: '',
			},
			view: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			download: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
			updatedAt: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			sequelize,
			modelName: MODEL_NAME,
			tableName: TABLE_NAME,
			timestamps: true,
		},
	);
	return User;
};
