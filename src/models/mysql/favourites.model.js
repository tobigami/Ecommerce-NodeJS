('use strict');

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Favourites extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Favourites.init(
		{
			id: {
				type: DataTypes.INTEGER(11),
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: DataTypes.TEXT(),
				allowNull: false,
			},
			author: {
				type: DataTypes.STRING(500),
				allowNull: false,
			},
			view: {
				type: DataTypes.INTEGER(11),
				allowNull: false,
				defaultValue: 0,
			},
			download: {
				type: DataTypes.INTEGER(11),
				allowNull: false,
				defaultValue: 0,
			},
		},
		{
			sequelize,
			tableName: 'Favourites',
			timestamps: true,
			charset: 'utf8',
			collate: 'utf8_general_ci',
		},
	);
	return Favourites;
};
