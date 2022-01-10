"use strict";

import { Constants } from "../utils/Constants.js";
import * as customValidators from "./_customValidators.js";

export default (sequelize, DataTypes) => {
	return sequelize.define("user", {
		// id: Discord user ID - provided by Discord API
		id: {
			primaryKey: true,
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isNumericString: customValidators.isNumericString,
			},
		},
		adren: {
			type: DataTypes.NUMBER,
			validate: {
				_isNumber: customValidators._isNumber,
			},
		},
		adrenc: {
			type: DataTypes.NUMBER,
			validate: {
				_isNumber: customValidators._isNumber,
			},
		},
		bal: {
			type: DataTypes.NUMBER,
			validate: {
				_isNumber: customValidators._isNumber,
			},
		},
		bcmd: {
			type: DataTypes.TEXT,
		},
		bgc: {
			type: DataTypes.NUMBER,
			validate: {
				_isNumber: customValidators._isNumber,
			},
		},
		bio: {
			type: DataTypes.STRING("2000"),
			defaultValue: "User has not set a bio.",
			validate: {
				len: [0, 1500],
			},
		},
		cfc: {
			type: DataTypes.NUMBER,
			validate: {
				_isNumber: customValidators._isNumber,
			},
		},
		chillc: {
			type: DataTypes.NUMBER,
			validate: {
				_isNumber: customValidators._isNumber,
			},
		},
		chillpills: {
			type: DataTypes.NUMBER,
			validate: {
				_isNumber: customValidators._isNumber,
			},
		},
		chnl: {
			type: DataTypes.TEXT,
			validate: {
				isAllNumbers: customValidators.allNumbers,
			},
		},
		clr: {
			type: DataTypes.STRING,
			defaultValue: "#00aaaa;0",
		},
		cmds: {
			type: DataTypes.NUMBER,
			validate: {
				_isNumber: customValidators._isNumber,
			},
		},
		cst: {
			type: DataTypes.TEXT,
		},
		cstmrl: {
			type: DataTypes.TEXT,
		},
		crls: {
			type: DataTypes.STRING,
			defaultValue: "dragon",
			validate: {
				isAlphanumeric: true,
			},
		},
		dgrc: {
			type: DataTypes.NUMBER,
			validate: {
				_isNumber: customValidators._isNumber,
			},
		},
		dlc: {
			type: DataTypes.NUMBER,
			validate: {
				_isNumber: customValidators._isNumber,
			},
		},
		dlstr: {
			type: DataTypes.STRING,
			validate: {
				isAllNumbers: customValidators.allNumbers,
			},
		},
		dns: {
			type: DataTypes.NUMBER,
			validate: {
				_isNumber: customValidators._isNumber,
			},
		},
		dose0: {
			type: DataTypes.NUMBER,
			validate: {
				_isNumber: customValidators._isNumber,
			},
		},
		dose1: {
			type: DataTypes.NUMBER,
			validate: {
				_isNumber: customValidators._isNumber,
			},
		},
		dpc: {
			type: DataTypes.NUMBER,
			validate: {
				_isNumber: customValidators._isNumber,
			},
		},
		drgs: {
			type: DataTypes.TEXT,
			validate: {
				isAllNumbers: customValidators.allNumbers,
			},
		},
		fdc: {
			type: DataTypes.NUMBER,
			validate: {
				_isNumber: customValidators._isNumber,
			},
		},
		fishc: {
			type: DataTypes.NUMBER,
			validate: {
				_isNumber: customValidators._isNumber,
			},
		},
		fsh: {
			type: DataTypes.STRING,
			validate: {
				isAllNumbers: customValidators.allNumbers,
			},
		},
		hgs: {
			type: DataTypes.NUMBER,
			validate: {
				_isNumber: customValidators._isNumber,
			},
		},
		mt: {
			type: DataTypes.STRING,
		},
		nick: {
			type: DataTypes.STRING,
		},
		ofncs: {
			type: DataTypes.STRING,
			validate: {
				isAllNumbers: customValidators.allNumbers,
			},
		},
		pet: {
			type: DataTypes.STRING,
			defaultValue: Constants.dragon,
			allowNull: false,
			validate: {
				isAllNumbers: customValidators.allNumbers,
			},
		},
		petbu: {
			type: DataTypes.STRING,
			validate: {
				isAllNumbers: customValidators.allNumbers,
			},
		},
		petname: {
			type: DataTypes.STRING(128),
			defaultValue: "dragon",
		},
		pq: {
			type: DataTypes.NUMBER,
			validate: {
				_isNumber: customValidators._isNumber,
			},
		},
		qts: {
			type: DataTypes.TEXT,
		},
		replacers: {
			type: DataTypes.TEXT,
		},
		rbc: {
			type: DataTypes.NUMBER,
			validate: {
				_isNumber: customValidators._isNumber,
			},
		},
		sgstc: {
			type: DataTypes.DECIMAL,
			validate: {
				_isNumber: customValidators._isNumber,
			},
		},
		spse: {
			type: DataTypes.STRING,
			unique: true,
			validate: {
				_isNumber: customValidators._isNumber,
			},
		},
		sntc: {
			type: DataTypes.NUMBER,
			validate: {
				_isNumber: customValidators._isNumber,
			},
		},
		srchc: {
			type: DataTypes.DECIMAL,
			validate: {
				_isNumber: customValidators._isNumber,
			},
		},
		stn: {
			type: DataTypes.NUMBER,
			validate: {
				_isNumber: customValidators._isNumber,
			},
		},
		stnb: {
			type: DataTypes.STRING(128),
		},
		strc: {
			type: DataTypes.NUMBER,
			validate: {
				_isNumber: customValidators._isNumber,
			},
		},
		upgr: {
			type: DataTypes.TEXT,
		},
		v: {
			type: DataTypes.STRING,
			defaultValue: "1;0",
			validate: {
				isAllNumbers: customValidators.allNumbers,
			},
		},
		wl: {
			type: DataTypes.STRING,
		},
		xp: {
			type: DataTypes.STRING,
			defaultValue: "1;0",
			validate: {
				isAllNumbers: customValidators.allNumbers,
			},
		},
		xpc: {
			type: DataTypes.NUMBER,
			validate: {
				_isNumber: customValidators._isNumber,
			},
		},
	});
};