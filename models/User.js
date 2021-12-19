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
			defaultValue: 0,
		},
		adrenc: {
			type: DataTypes.NUMBER,
			defaultValue: 0,
		},
		bal: {
			type: DataTypes.NUMBER,
			defaultValue: 0,
		},
		bcmd: {
			type: DataTypes.TEXT,
			defaultValue: "",
		},
		bgc: {
			type: DataTypes.NUMBER,
			defaultValue: 0,
		},
		bio: {
			type: DataTypes.STRING,
			defaultValue: "User has not set a bio.",
		},
		cfc: {
			type: DataTypes.NUMBER,
			defaultValue: 0,
		},
		cgrl: {
			type: DataTypes.TEXT,
		},
		chillc: {
			type: DataTypes.NUMBER,
			defaultValue: 0,
		},
		chillpills: {
			type: DataTypes.NUMBER,
			defaultValue: 0,
		},
		chnl: {
			type: DataTypes.TEXT,
			defaultValue: "",
		},
		clr: {
			type: DataTypes.STRING,
			defaultValue: "#00aaaa;0",
		},
		cmds: {
			type: DataTypes.NUMBER,
			defaultValue: 0,
		},
		cst: {
			type: DataTypes.TEXT,
			defaultValue: "",
		},
		cstmk: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
		crls: {
			type: DataTypes.STRING,
			defaultValue: "default",
		},
		dgrc: {
			type: DataTypes.NUMBER,
			defaultValue: 0,
		},
		dlc: {
			type: DataTypes.NUMBER,
			defaultValue: 0,
		},
		dns: {
			type: DataTypes.NUMBER,
			defaultValue: 0,
		},
		dose0: {
			type: DataTypes.NUMBER,
			defaultValue: 0,
		},
		dose1: {
			type: DataTypes.NUMBER,
			defaultValue: 0,
		},
		dpc: {
			type: DataTypes.NUMBER,
			defaultValue: 0,
		},
		drgs: {
			type: DataTypes.TEXT,
			defaultValue: "",
		},
		fdc: {
			type: DataTypes.NUMBER,
			defaultValue: 0,
		},
		fishc: {
			type: DataTypes.NUMBER,
			defaultValue: 0,
		},
		fsh: {
			type: DataTypes.STRING,
			defaultValue: "0;0;0;0;0",
		},
		hgs: {
			type: DataTypes.NUMBER,
			defaultValue: 0,
		},
		mt: {
			type: DataTypes.STRING,
		},
		nick: {
			type: DataTypes.STRING,
		},
		ofncs: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
		prefix: {
			type: DataTypes.STRING,
			defaultValue: "~",
		},
		pet: {
			type: DataTypes.STRING,
			defaultValue: "1;10000;100;0;1;1;1;1;0;1",
		},
		petbu: {
			type: DataTypes.STRING,
		},
		petname: {
			type: DataTypes.STRING,
			defaultValue: "dragon",
		},
		replacers: {
			type: DataTypes.TEXT,
			defaultValue: "",
		},
		robc: {
			type: DataTypes.NUMBER,
			defaultValue: 0,
		},
		sgstc: {
			type: DataTypes.NUMBER,
			defaultValue: 0,
		},
		spse: {
			type: DataTypes.STRING,
			unique: true,
		},
		sntc: {
			type: DataTypes.NUMBER,
			defaultValue: 0,
		},
		srchc: {
			type: DataTypes.NUMBER,
			defaultValue: 0,
		},
		stn: {
			type: DataTypes.NUMBER,
			defaultValue: 0,
		},
		stnb: {
			type: DataTypes.STRING,
			defaultValue: "stunned",
		},
		strc: {
			type: DataTypes.NUMBER,
			defaultValue: 0,
		},
		upgr: {
			type: DataTypes.TEXT,
			defaultValue: "",
		},
		v: {
			type: DataTypes.STRING,
			defaultValue: "1;0",
		},
		wl: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
		xp: {
			type: DataTypes.STRING,
			defaultValue: "1;0",
		},
		xpc: {
			type: DataTypes.NUMBER,
			defaultValue: 0,
		},
	});
};