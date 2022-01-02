const customValidators = {
	allNumbers: function(data) {
		data = data.toString().split(";");
		data = data.map(Number);
		if (data.includes(NaN)) throw new Error("[NumberArray]: All values must be numeric.");
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
				isNumeric: true,
			},
		},
		adren: {
			type: DataTypes.NUMBER,
			validate: {
				isNumeric: true,
			},
		},
		adrenc: {
			type: DataTypes.NUMBER,
			validate: {
				isNumeric: true,
			},
		},
		bal: {
			type: DataTypes.NUMBER,
			validate: {
				isNumeric: true,
			},
		},
		bcmd: {
			type: DataTypes.TEXT,
		},
		bgc: {
			type: DataTypes.NUMBER,
			validate: {
				isNumeric: true,
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
				isNumeric: true,
			},
		},
		chillc: {
			type: DataTypes.NUMBER,
			validate: {
				isNumeric: true,
			},
		},
		chillpills: {
			type: DataTypes.NUMBER,
			validate: {
				isNumeric: true,
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
				isNumeric: true,
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
				isNumeric: true,
			},
		},
		dlc: {
			type: DataTypes.NUMBER,
			validate: {
				isNumeric: true,
			},
		},
		dlstr: {
			type: DataTypes.STRING,
			validate: {
				isAlphanumeric: true,
			},
		},
		dns: {
			type: DataTypes.NUMBER,
			validate: {
				isNumeric: true,
			},
		},
		dose0: {
			type: DataTypes.NUMBER,
			validate: {
				isNumeric: true,
			},
		},
		dose1: {
			type: DataTypes.NUMBER,
			validate: {
				isNumeric: true,
			},
		},
		dpc: {
			type: DataTypes.NUMBER,
			validate: {
				isNumeric: true,
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
				isNumeric: true,
			},
		},
		fishc: {
			type: DataTypes.NUMBER,
			validate: {
				isNumeric: true,
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
				isNumeric: true,
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
				isNumeric: true,
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
				isNumeric: true,
			},
		},
		sgstc: {
			type: DataTypes.DECIMAL,
			validate: {
				isNumeric: true,
			},
		},
		spse: {
			type: DataTypes.STRING,
			unique: true,
			validate: {
				isNumeric: true,
			},
		},
		sntc: {
			type: DataTypes.NUMBER,
			validate: {
				isNumeric: true,
			},
		},
		srchc: {
			type: DataTypes.DECIMAL,
			validate: {
				isNumeric: true,
			},
		},
		stn: {
			type: DataTypes.NUMBER,
			validate: {
				isNumeric: true,
			},
		},
		stnb: {
			type: DataTypes.STRING(128),
		},
		strc: {
			type: DataTypes.NUMBER,
			validate: {
				isNumeric: true,
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
				isNumeric: true,
			},
		},
	});
};