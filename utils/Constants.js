"use strict";

import { MessageEmbed } from "discord.js";

const Constants = {
	owners: ["501710994293129216"],
	get display() {
		return this.owners[0];
	},
	ssInvite: "https://discord.gg/",
	supportServer: "911784758600679455",
	prefix: "~",
	botInvite: "https://discord.com/oauth2/authorize?client_id=671708767813107724&scope=bot&permissions=67456065",
	dailyReward: 5_000,
	upgr: ["int;intellect;5", "end;endurance;6", "str;strength;7", "gl;glycogenesis;9"],
	// following doubles each time, so it becomes harder for users to level up their dragon as their dragon becomes a higher level (and thus a higher requirement of XP to level up once more). These values were previously determined by an algorithm, however I deemed it faster in the ling run to just have them hard-coded. It saves processing time too, albeit not much, but it can help the bot catch up if there are loads of incompleted requests.
	reqs: [400, 800, 1600, 3200, 6400, 12800, 25600, 51200, 102400, 204800, 409600, 819200, 1638400, 3276800, 6553600, 13107200, 26214400, 52428800, 104857600, 209715200, 419430400, 838860800, 1677721600, 3355443200, 6710886400, 13421772800, 26843545600, 53687091200, 107374182400, 214748364800, 429496729600, 858993459200, 1717986918400, 3435973836800, 6871947673600, 13743895347200, 27487790694400, 54975581388800, 109951162777600, 219902325555200, 439804651110400, 879609302220800, 1759218604441600, 3518437208883200, 7036874417766400, 14073748835532800, 28147497671065600, 56294995342131200, 112589990684262400, 225179981368524800],
	PET_EMOJIS: [ "<:heart:912982056802340877>", ":zap:", ":star2:", ":star:", ":bulb:", ":field_hockey:", ":fire:", ":sparkling_heart:", ":pizza:" ],
	intendedPetLength: 10,
	dragon: "1;10000;100;0;1;1;1;1;0;1",
	maxDragon: "999999999;999999999;999999999;999999999;999999999;999999999;999999999;999999999;999999999;999999999",
	clr: "#00aaaa",
	maxLvl: 50,
	boostPay: 5000,
	exp: 60000,
	inf: "∞",
	cds: ["adrenc;dose adrenaline", "cfc;coinflip", "dialc;dial", "dlc;daily", "dpc;deprive", "dgrc;downgrade", "fdc;feed", "fishc;fish", "rbc;rob", "sntc;sentence", "sgstc;suggest", "srchc;search", "strc;stroke", "xpc;xp cooldown"],
	badges: {
		administrator132465798: "<:admin:926431897695973436>",
		owners: "<:owners:926433334140235786>",
		bughunter: "<:bughunter:927443784738942976>",
		dev: "<:verified_developer:927445077415039036>",
		booster: "<:booster:927445472661098546>",
		pstn: "<:permstunned:927446547547951135>",
	},
	channels: {
		dsl: "918090868798423060",
		pfx: "912615890036604939",
		adminlog: "912615914330017802",
		sflp: "913342404772372490",
		spamCat: "913341555975274507",
		appNotifs: "912616373769875456",
		appCat: "913341136939139082",
		bug: "912616349879107584",
		general: "911784758600679459",
		ready: "912615725347254332",
		reconnecting: "912615820125958185",
		error: "912615833056976936",
		rateLimit: "912615845161758730",
		guildLogs: "912616010916433930",
		memberLog: "912616064112816148",
		modlog: "912616081238142976",
		set: "912616091266736148",
		suggestions: "912616289216909332",
		msgLogs: "912616260431400971",
		boostAnnCh: "912616201715322940",
		bugLog: "912616173978419240",
		cmdLog: "912616134057025536",
	},
	roles: {
		kw: "912641078547607582",
		applicant: "912641084604153866",
		judge: "912641088551010314",
		businessman: "912641098042732575",
		updates: "912641384589164544",
		SERVER_BOOSTER: "",
		db: "912641300505968640",
		nerd: "912641306369593396",
		civilian: "912617302279716886",
		admin: "911801537968369685",
		mod: { trial: "912641359297511515", normal: "912641363944824832" },
		rebel: "912641468320088134",
		sarg: "912641474900946974",
		staff: "912641480890413056",
		cit: "912641662663131196",
		col: "912641555184123924",
		supreme: "912641563291713566",
		warrior: "912641565346914304",
		human: "912641644547936267",
		memberRole: "912641644547936267",
		muted: "912641654391988224",
		civ: "912641353333211146",
		botDeveloper: "912641730522783795",
		srmod: "912641369141559297",
	},
	emoji: {
		tick: "<:tick:912982622731370576>",
		err: "<:error:912982623830282281>",
		fishing_rod: "<:fishrod:912982603425005588>",
		mobile_phone: ":iphone:",
		phonebook: ":book:",
		chill: "<:chillpill:912982008077107280>",
		loading: "<a:googleloading:912982110556545094>",
		target: "<:target:912982532461588600>",
		heart: "<:heart:912982056802340877>",
		adrenaline: "💉",
		slrprmt: ":receipt:",
		bvault: ":bank:",
		rc: ":rainbow:",
	},
	colors: {
		green: "#4bc46b",
		red: "#e61c1c",
		invisible: "#36393e",
	},
	webhooks: {
		debugger: "https://discord.com/api/webhooks/914286031325507584/rp7BIeS5RaZegZI3YzSfUlpyxASeA0dJfWC48O38fcaEe6EyH7LEAUxWY6mimmq0Ucyj",
	},
	ofncs: {
		"1": [ "Spam", 1 ],
		"2": [ "Excessive Mentions", 1 ],
		"3": [ "Begging", 1 ],
		"4": [ "Impersonating Staff", 1 ],
		"5": [ "Discrimination", 1 ],
		"6": [ "Advertising", 3 ],
		"7": [ "NSFW", 2 ],
		"8": [ "Threats", 2 ],
		"9": [ "Joking about Mental Illnesses (or any other disability)", 3 ],
		"10": [ "Disrespecting Privacy", 3 ],
		"11": [ "Exploiting Glitches", 3 ],
		"12": [ "Bypassing Punishments via the means of alts", 4 ],
		"13": [ "Leaving server to evade punishments (before punished; not after)", 4 ],
		"14": [ "Excessively Rude", 1 ],
	},
	foods: {
		dolp: {
			name: "dolphin",
			key: "fsh;0",
			emoji: ":dolphin:",
			gives: {
				hp: 100,
				en: 10,
			},
		},
		sh: {
			name: "shark",
			key: "fsh;1",
			emoji: ":shark:",
			gives: {
				hp: 0,
				en: 50,
			},
		},
		blow: {
			name: "blowfish",
			key: "fsh;2",
			emoji: ":blowfish:",
			gives: {
				hp: 0,
				en: 15,
			},
		},
		trop: {
			name: "tropical_fish",
			key: "fsh;3",
			emoji: ":tropical_fish:",
			gives: {
				hp: 500,
				en: 35,
			},
		},
		f: {
			name: "fish",
			key: "fsh;4",
			emoji: ":fish:",
			gives: {
				hp: 2500,
				en: 55,
			},
		},
		ch: {
			name: "chillpill",
			key: "chillpills",
			emoji: "<:chillpill:722828409331253349>",
			gives: {
				hp: 0,
				en: 100,
			},
		},
	},
};


Constants.ditems = [`b;businessman;${Constants.roles.businessman};9999999999999999`, `col;colorist;${Constants.roles.col};2500`, `judge;judge;${Constants.roles.judge};1000`, `nerd;nerd;${Constants.roles.nerd};500`, `reb;rebel;${Constants.roles.rebel};250`, `s;supreme;${Constants.roles.supreme};10000`, `upda;updates;${Constants.roles.updates};1`];

Constants.cstSpecials = [
	[ "kw", Constants.roles.kw ],
	[ "judge", Constants.roles.judge ],
	[ "businessman", Constants.roles.businessman ],
	[ "nerddd", Constants.roles.nerd ],
	[ "civilian", Constants.roles.civilian ],
	[ "muted", Constants.roles.muted ],
	[ "rebel", Constants.roles.rebel ],
	[ "supreme", Constants.roles.supreme ],
	[ "colorist", Constants.roles.col ],
	[ "tmod", Constants.roles.mod.trial ],
	[ "moderator", Constants.roles.mod.normal ],
	[ "srmod", Constants.roles.srmod ],
	[ "citizen", Constants.roles.cit ],
	[ "updt", Constants.roles.updates ],
];

Constants.shop = {
	fishrod: {
		displayName: "Fishing rod",
		id: 1,
		emoji: Constants.emoji.fishing_rod,
		description: "Allows you to go fishing via `~fish`",
		price: 250,
		method: "cst",
		condt: null,
	},
	slrprmt: {
		displayName: "The Seller's Permit",
		id: 2,
		emoji: Constants.emoji.slrprmt,
		description: "Allows you to sell in-game items via `~sell`",
		price: 50_000,
		method: "cst",
		condt: null,
	},
	chillpills: {
		displayName: "1x Chill Pill",
		id: 101,
		emoji: Constants.emoji.chill,
		description: "clears **all** exisiting cooldowns, 6 hour cooldown for consuimg this item; consume with `~dose chill`",
		price: 10,
		// method: incremental of (chillpills)
		// todo: dump [chillpills, adren] into a `drugs` or `drgs` key.
		method: "drgs.0",
		condt: null,
	},
	adren: {
		displayName: "1x Adrenaline Syringe",
		id: 101,
		emoji: Constants.emoji.chill,
		description: "clears **all** exisiting cooldowns, 6 hour cooldown for consuimg this item; consume with `~dose chill`",
		price: 10,
		// method: incremental of (chillpills)
		// todo: dump [chillpills, adren] into a `drugs` or `drgs` key.
		method: "drgs.0",
		condt: null,
	},
	bvault: {
		displayName: "Bank Vault",
		id: 201,
		emoji: Constants.emoji.bvault,
		description: "Allows you to store money where it's safely hidden away from robbers; `~vault` to view your vault",
		price: 25_000,
		condt: null,
	},
	rc: {
		displayName: "Random Colour Preference",
		id: 202,
		emoji: Constants.emoji.rc,
		description: "Set a random colour preference whilst using commands",
		price: 2_500,
		execute: (async (id, client) => {
			await client.db.getUserData(id);
			// I'm aware this can be written as one line, but I've decided to write it like this so it's easier to read.
			await client.db.USERS.udpate({
				clr: "RANDOM;0",
			}, {
				where: {
					id,
				},
			});
		}),
		condt: "message.author.color == \"RANDOM;0\"",
	},
};

Constants.doses = [
	[ `ch;chillpill;1;chillc;6h;${Constants.emoji.chill}`, (async (message) => {
		const x = await message.client.db.get(`chillpills${message.author.id}`) || 0;
		if (Number(x) == 0) {
			return message.reply(`${Constants.emoji.chill} You don"t have any chill pills!`);
		}
		await message.client.db.set(`chillpills${message.author.id}`, Number(x - 1));
		Constants.cds.forEach(async (c) => {
			c = c.split(";")[0];
			await message.client.db.delete(c + message.author.id);
		});
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has consumed a ${message.client.Constants.statics.emoji.chill} and cleared all of their cooldowns!`),
			],
		});
	}),
	], [
		"adren;adrenaline;45m;adrenc;3h;💉", (async (message) => {
			let adren = await message.client.db.get("adren" + message.author.id);
			if (!adren || (isNaN(adren))) adren = 0; else adren = Number(adren);
			if (adren - 1 < 0) return message.reply("You don't have any adrenaline left!");
			adren -= 1;
			await message.client.db.set("adren" + message.author.id, adren);
			message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag} has injected themselves with 💉!`),
				],
			});
		}),
	],
];

export { Constants };