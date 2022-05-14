"use strict";
import { Constants } from "../utils/Constants.js";

export default (sequelize, DataTypes) => {
	return sequelize.define("guild", {
		id: {
			primaryKey: true,
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		prefix: {
			type: DataTypes.STRING,
			defaultValue: Constants.prefix,
		},
	});
};