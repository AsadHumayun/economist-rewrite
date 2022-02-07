"use strict";

export default (Sequelize, DataTypes) => {
	return Sequelize.define("channel", {
		id: {
			primaryKey: true,
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		/**
		 * Whether or not commands can be run in the channel.
		 * @type {boolean}
		 */
		dsbs: {
			type: DataTypes.BOOLEAN,
			default: false,
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