const customValidators = {
	allNumbers: function(data) {
		data = data.toString().split(";").map(Number);
		if (data.includes(NaN)) throw new Error("\n[CustomValidator => allNumbers] [Fail] All values must be numeric.");
	},
	isNumericString: function(data) {
		if (typeof data !== "string" || isNaN(data)) throw new Error(`\n[CustomValidator => isNumericString] [Fail] ID must be a numeric string. Received type: ${typeof data} (NaN?: ${isNaN(data)})`);
	},
	// had to be introduced because Sequelize didn't recognise standard form numbers as numbers :shrug:
	isNumber: function(data) {
		if (isNaN(Number(data))) throw new Error(`\n[CustomValidator => isNumber] [Fail] Value must be a valid JavaScript number. Received type: ${typeof data}`);
	},
};

module.exports = (sequelize, DataTypes) => {
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
				isNumber: customValidators.isNumber,
			},
		},
		adrenc: {
			type: DataTypes.NUMBER,
			validate: {
				isNumber: customValidators.isNumber,
			},
		},
		bal: {
			type: DataTypes.NUMBER,
			validate: {
				isNumber: customValidators.isNumber,
			},
		},
		bcmd: {
			type: DataTypes.TEXT,
		},
		bgc: {
			type: DataTypes.NUMBER,
			validate: {
				isNumber: customValidators.isNumber,
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
				isNumber: customValidators.isNumber,
			},
		},
		chillc: {
			type: DataTypes.NUMBER,
			validate: {
				isNumber: customValidators.isNumber,
			},
		},
		chillpills: {
			type: DataTypes.NUMBER,
			validate: {
				isNumber: customValidators.isNumber,
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
				isNumber: customValidators.isNumber,
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
				isNumber: customValidators.isNumber,
			},
		},
		dlc: {
			type: DataTypes.NUMBER,
			validate: {
				isNumber: customValidators.isNumber,
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
				isNumber: customValidators.isNumber,
			},
		},
		dose0: {
			type: DataTypes.NUMBER,
			validate: {
				isNumber: customValidators.isNumber,
			},
		},
		dose1: {
			type: DataTypes.NUMBER,
			validate: {
				isNumber: customValidators.isNumber,
			},
		},
		dpc: {
			type: DataTypes.NUMBER,
			validate: {
				isNumber: customValidators.isNumber,
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
				isNumber: customValidators.isNumber,
			},
		},
		fishc: {
			type: DataTypes.NUMBER,
			validate: {
				isNumber: customValidators.isNumber,
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
				isNumber: customValidators.isNumber,
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
			defaultValue: "1;10000;100;0;1;1;1;1;0;1",
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
				isNumber: customValidators.isNumber,
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
				isNumber: customValidators.isNumber,
			},
		},
		sgstc: {
			type: DataTypes.DECIMAL,
			validate: {
				isNumber: customValidators.isNumber,
			},
		},
		spse: {
			type: DataTypes.STRING,
			unique: true,
			validate: {
				isNumber: customValidators.isNumber,
			},
		},
		sntc: {
			type: DataTypes.NUMBER,
			validate: {
				isNumber: customValidators.isNumber,
			},
		},
		srchc: {
			type: DataTypes.DECIMAL,
			validate: {
				isNumber: customValidators.isNumber,
			},
		},
		stn: {
			type: DataTypes.NUMBER,
			validate: {
				isNumber: customValidators.isNumber,
			},
		},
		stnb: {
			type: DataTypes.STRING(128),
		},
		strc: {
			type: DataTypes.NUMBER,
			validate: {
				isNumber: customValidators.isNumber,
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
				isNumber: customValidators.isNumber,
			},
		},
	});
};