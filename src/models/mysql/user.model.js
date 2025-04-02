'use strict';

const MODEL_NAME = 'User';
const TABLE_NAME = 'User';

const { Model } = require('sequelize');
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
			age: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			name: {
				type: DataTypes.TEXT,
				defaultValue: '',
			},
			email: {
				type: DataTypes.TEXT,
				defaultValue: '',
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
