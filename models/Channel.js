"use strict";
module.exports = (Sequelize, DataTypes) => {
	return Sequelize.define("channel", {
		id: {
			primaryKey: true,
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		pkg: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		snipe: {
			type: DataTypes.TEXT,
			// the base64 after the ; just says that no snipeable message found in current channel.
			defaultValue: "911799544017199124;Tm8gbWVzc2FnZSBmb3VuZCB3aXRoaW4gY3VycmVudCBjaGFubmVsLg",
		},
	});
};