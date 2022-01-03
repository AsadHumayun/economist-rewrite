"use strict";
module.exports = (sequelize, DataTypes) => {
	return sequelize.define("bug", {
		id: {
			primaryKey: true,
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		number: {
			type: DataTypes.NUMBER,
			allowNull: false,
		},
		submitter: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		msg: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		at: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});
};