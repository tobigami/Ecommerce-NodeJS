/**
 * select * 4:13
 * des:  2:03
 */

'use strict';

const MODEL_NAME = 'User';
const TABLE_NAME = 'users';

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
			user_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			user_email: {
				type: DataTypes.STRING(30),
				defaultValue: '',
				allowNull: false,
			},
			user_phone: {
				type: DataTypes.STRING(15),
				defaultValue: '',
				allowNull: false,
			},
			user_username: {
				type: DataTypes.STRING(30),
				defaultValue: '',
				allowNull: false,
			},
			user_password: {
				type: DataTypes.STRING(100),
				defaultValue: '',
				allowNull: false,
			},
			user_status: {
				type: DataTypes.TINYINT,
				defaultValue: 0,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: MODEL_NAME,
			tableName: TABLE_NAME,
			timestamps: true,
			createdAt: 'user_createdAt',
			updatedAt: 'user_updatedAt',
		},
	);
	return User;
};
