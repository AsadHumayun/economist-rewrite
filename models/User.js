module.exports = (sequelize, DataTypes) => {
	return sequelize.define("user", {
		// id: Discord user ID - provided by Discord API
		id: {
			primaryKey: true,
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		adren: {
			type: DataTypes.NUMBER,
		},
		adrenc: {
			type: DataTypes.NUMBER,
		},
		bal: {
			type: DataTypes.NUMBER,
		},
		bcmd: {
			type: DataTypes.TEXT,
		},
		bgc: {
			type: DataTypes.NUMBER,
		},
		bio: {
			type: DataTypes.STRING,
			defaultValue: "User has not set a bio.",
		},
		cfc: {
			type: DataTypes.NUMBER,
		},
		chillc: {
			type: DataTypes.NUMBER,
		},
		chillpills: {
			type: DataTypes.NUMBER,
		},
		chnl: {
			type: DataTypes.TEXT,
		},
		clr: {
			type: DataTypes.STRING,
			defaultValue: "#00aaaa;0",
		},
		cmds: {
			type: DataTypes.NUMBER,
		},
		cst: {
			type: DataTypes.TEXT,
		},
		cstmrl: {
			type: DataTypes.TEXT,
		},
		crls: {
			type: DataTypes.STRING,
			defaultValue: "default",
		},
		dgrc: {
			type: DataTypes.NUMBER,
		},
		dlc: {
			type: DataTypes.NUMBER,
		},
		dlstr: {
			type: DataTypes.STRING,
		},
		dns: {
			type: DataTypes.NUMBER,
		},
		dose0: {
			type: DataTypes.NUMBER,
		},
		dose1: {
			type: DataTypes.NUMBER,
		},
		dpc: {
			type: DataTypes.NUMBER,
		},
		drgs: {
			type: DataTypes.TEXT,
		},
		fdc: {
			type: DataTypes.NUMBER,
		},
		fishc: {
			type: DataTypes.NUMBER,
		},
		fsh: {
			type: DataTypes.STRING,
		},
		hgs: {
			type: DataTypes.NUMBER,
		},
		mt: {
			type: DataTypes.STRING,
		},
		nick: {
			type: DataTypes.STRING,
		},
		ofncs: {
			type: DataTypes.STRING,
		},
		pet: {
			type: DataTypes.STRING,
			defaultValue: "1;10000;100;0;1;1;1;1;0;1",
			allowNull: false,
		},
		petbu: {
			type: DataTypes.STRING,
		},
		petname: {
			type: DataTypes.STRING(128),
			defaultValue: "dragon",
		},
		pq: {
			type: DataTypes.NUMBER,
		},
		qts: {
			type: DataTypes.TEXT,
		},
		replacers: {
			type: DataTypes.TEXT,
		},
		robc: {
			type: DataTypes.NUMBER,
		},
		sgstc: {
			type: DataTypes.DECIMAL,
		},
		spse: {
			type: DataTypes.STRING,
			unique: true,
		},
		sntc: {
			type: DataTypes.NUMBER,
		},
		srchc: {
			type: DataTypes.DECIMAL,
		},
		stn: {
			type: DataTypes.NUMBER,
		},
		stnb: {
			type: DataTypes.STRING(128),
			defaultValue: "stunned",
		},
		strc: {
			type: DataTypes.NUMBER,
		},
		upgr: {
			type: DataTypes.TEXT,
		},
		v: {
			type: DataTypes.STRING,
			defaultValue: "1;0",
		},
		wl: {
			type: DataTypes.STRING,
		},
		xp: {
			type: DataTypes.STRING,
			defaultValue: "1;0",
		},
		xpc: {
			type: DataTypes.DECIMAL,
		},
	});
};