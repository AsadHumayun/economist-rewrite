"use strict";

import { MessageEmbed } from "discord.js";

/**
 * Values that remain static and are used throughout the whole programme.
 * It is advised to take care when modifying this file.
 * @onst {object}
 */
const Constants = {
	/**
	 * Array of owner IDs
	 * @const {string[]}
	 */
	owners: ["501710994293129216"],
	/**
	 * The ID of the owner to display on every command (eg `Contact User#1234 for help!`, User#1234 would be the owner's tag).
	 * @const {string}
	 */
	get display() {
		return this.owners[0];
	},
	/**
	 * An invite to the bot's support server
	 * @const {string}
	 */
	ssInvite: "https://discord.gg/",
	/**
	 * The ID of the bot's support server
	 * @const {string}
	 */
	supportServer: "911784758600679455",
	/**
	 * A static invite URL for the bot.
	 * Users can use this to add the bot to their guild (supplied by Discord).
	 * @const {string}
	 */
	botInvite: "https://discord.com/oauth2/authorize?client_id=671708767813107724&scope=bot&permissions=67456065",
	/**
	 * The default prefix for all servers.
	 * @const {string}
	 */
	prefix: "~",
	/**
	 * The amount of money that users will receive every time they run the `daily` command.
	 * Multiplies with streak.
	 * @const {number}
	 */
	dailyReward: 2_500,
	/**
	 * Upgradable stats in context of the `dragon` system.
	 * @const {string[]}
	 */
	upgr: ["int;intellect;5", "end;endurance;6", "str;strength;7", "gl;glycogenesis;9"],
	/**
	 * The amount of XP required to obtain each dragon level, starting with the amount of XP needed to obtain level 2 being `400`.
	 * Doubles each time, so it becomes more difficult as they (the users) progress.
	 * @const {number[]}
	 */
	reqs: [400, 800, 1600, 3200, 6400, 12800, 25600, 51200, 102400, 204800, 409600, 819200, 1638400, 3276800, 6553600, 13107200, 26214400, 52428800, 104857600, 209715200, 419430400, 838860800, 1677721600, 3355443200, 6710886400, 13421772800, 26843545600, 53687091200, 107374182400, 214748364800, 429496729600, 858993459200, 1717986918400, 3435973836800, 6871947673600, 13743895347200, 27487790694400, 54975581388800, 109951162777600, 219902325555200, 439804651110400, 879609302220800, 1759218604441600, 3518437208883200, 7036874417766400, 14073748835532800, 28147497671065600, 56294995342131200, 112589990684262400, 225179981368524800],
	/**
	 * Array consisting of all the default emojis for the dragon system.
	 * @const {string[]}
	 */
	PET_EMOJIS: ["<:heart:912982056802340877>", ":zap:", ":star2:", ":star:", ":bulb:", ":field_hockey:", ":fire:", ":sparkling_heart:", ":pizza:"],
	/**
	 * The intended array length for dragons.
	 * Prevents unexpected behaviours.
	 * @const {number}
	 */
	intendedPetLength: 10,
	/**
	 * The default value for dragons when a user does not have one set. This should be passed directly into the `models/User.js` file.
	 * @const {string}
	 */
	dragon: "1;10000;100;0;1;1;1;1;0;1",
	/**
	 * The state in which a dragon will be when the user in context possesses the `maxdragon888` cst.
	 * @const {string}
	 */
	maxDragon: "999999999;999999999;999999999;999999999;999999999;999999999;999999999;999999999;999999999;999999999",
	/**
	 * The default colour preference for all users.
	 * Shown on embeds.
	 * @const {string}
	 */
	clr: "#00aaaa",
	/**
	 * The maximum level that a dragon may be before it is counted as "maxed" out.
	 * @const {number}
	 */
	maxLvl: 50,
	/**
	 * How much money a user will received in their balance once they boost the server.
	 * @const {number}
	 */
	boostPay: 1_500,
	/**
	 * Exponent used to convert from MS to minutes.
	 * @const {number}
	 */
	exp: 60000,
	/**
	 * The infinity symbol.
	 * @const {string}
	 */
	inf: "∞",
	/**
	 * The keys of the cooldowns of each command, and their corresponding display names. Used in the `cooldowns` command.
	 * @const {string[]}
	 */
	cds: ["adrenc;dose adrenaline", "cfc;coinflip", "dialc;dial", "dlc;daily", "dpc;deprive", "dgrc;downgrade", "fdc;feed", "fishc;fish", "rbc;rob", "sntc;sentence", "sgstc;suggest", "srchc;search", "strc;stroke", "xpc;xp cooldown"],
	/**
	 * The configured badges along with their emoji IDs.
	 * The keys of each property act as the CST that a user must possess in order for them to have the badge, and the corresponding value is that badge's emoji ID.
	 * Used in the `profile` command. There will be no further comments inside this object as it's all pretty self-explanatory.
	 * @const {object}
	 */
	badges: {
		administrator132465798: "<:admin:926431897695973436>",
		owners: "<:owners:926433334140235786>",
		bughunter: "<:bughunter:927443784738942976>",
		dev: "<:verified_developer:927445077415039036>",
		booster: "<:booster:927445472661098546>",
		pstn: "<:permstunned:927446547547951135>",
	},
	/**
	 * All of the required channels for the Discord client to function.
	 * Primarily logging or config channels.
	 * @const {object}
	 */
	channels: {
		/**
		 * The ID of the channel in which dragon disowns are logged.
		 * @const {string}
		 */
		dsl: "918090868798423060",
		/**
		 * The ID of the channel in which guild prefix changes are logged.
		 * @const {string}
		 */
		pfx: "912615890036604939",
		/**
		 * The ID of the channel in which the usage of administrator-level commands are logged.
		 * **Pretty important**.
		 * @const {string}
		 */
		adminlog: "912615914330017802",
		/**
		 * The ID of the channel in which channel overwrites are logged (refer to events/channelUpdate.js and events/channelCreate.js)
		 * @const {string}
		 */
		sflp: "913342404772372490",
		/**
		 * The ID of the category in which users are allowed to freely spam, and hence will not be muted upon hitting the msg send rate limit.
		 * @const {string}
		 */
		spamCat: "913341555975274507",
		/**
		 * The ID of the channel in which notifications for staff applications are sent to.=
		 * @const {string}
		 */
		appNotifs: "912616373769875456",
		/**
		 * The ID of the category in which users' application channels will be created.
		 * @const {string}
		 */
		appCat: "913341136939139082",
		/**
		 * The ID of the channel in which bugs are logged.
		 * @const {string}
		 */
		bug: "912616349879107584",
		/**
		 * The ID of the `general` guild channel in the support server.
		 * @const {string}
		 */
		general: "911784758600679459",
		/**
		 * The ID of the channel in which instances of the `ready` event are logged.
		 * @const {string}
		 */
		ready: "912615725347254332",
		/**
		 * The ID of the channel in which errors are logged.
		 * @const {string}
		 */
		error: "912615833056976936",
		/**
		 * The ID of the channel in which the bot's entrance and exit of guilds is logged.
		 * @const {string}
		 */
		guildLogs: "912616010916433930",
		/**
		 * The ID of the channel in which member joins/leaves are logged, only in the support server.
		 * @const {string}
		 */
		memberLog: "912616064112816148",
		/**
		 * The ID of the channel in which moderator actions are logged. (Support server only)
		 * @const {string}
		 */
		modlog: "912616081238142976",
		/**
		 * The ID of the channel in which uses of the set command are logged.
		 * This is no longer necessary due to the addition of `adminlogs` and will be removed in the future.
		 * @deprecated
		 * @const {string}
		 */
		set: "912616091266736148",
		/**
		 * The ID of the channel in which users' suggestions are forwarded to.
		 * @const {string}
		 */
		suggestions: "912616289216909332",
		/**
		 * The ID of the channel in which message edits/deleted messages are logged.
		 * @const {string}
		 */
		msgLogs: "912616260431400971",
		/**
		 * The ID of the channel in which boost messages are sent in.
		 * @const {string}
		 */
		boostAnnCh: "912616201715322940",
		/**
		 * The ID of the channel in which bugs are logged.
		 * @const {string}
		 */
		bugLog: "912616173978419240",
		/**
		 * The ID of the channel in which command uses are logged.
		 * No longer used, may be removed in a future update.
		 * @deprecated
		 * @const {string}
		 */
		cmdLog: "912616134057025536",
	},
	/**
	 * The role IDs which are registered by the bot.
	 * These are typically used to give/transfer permissions, and keep track of permissions.
	 */
	roles: {
		/**
		 * The ID of the role bound to the Keyboard Warrior role.
		 * @const {string}
		 */
		kw: "912641078547607582",
		/**
		 * The ID of the role which users receive once they use the `apply` command.
		 * @const {string}
		 */
		applicant: "912641084604153866",
		/**
		 * The ID of the role bound to the Judge permission.
		 * @const {string}
		 */
		judge: "912641088551010314",
		/**
		 * The ID of the role bound to the Businessman permission.
		 * @deprecated
		* @const {string}
		 */
		businessman: "912641098042732575",
		/**
		 * The ID of the Updates role.
		 * This role gets mentioned for updates/announcements.
		 * @const {string}
		 */
		updates: "912641384589164544",
		/**
		 * The ID of the Server Booster role.
		 * @const {string}
		 */
		SERVER_BOOSTER: "",
		/**
		 * DBM, may be removed soon.
		 * @deprecated
		 * @const {string}
		 */
		db: "912641300505968640",
		/**
		 * The ID of the role bound to the Nerd permission.
		 * @const {string}
		 */
		nerd: "912641306369593396",
		/**
		 * The ID of the Civilian role.
		 * @const {string}
		 */
		civilian: "912617302279716886",
		/**
		 * The ID of the Admin role.
		 * @const {string}
		 */
		admin: "911801537968369685",
		/**
		 * The ID of the role bound to the Judge permission.
		 * @property {string} trial ID of the trial moderator role
		 * @property {string} normal ID of the normal moderator role
		 * @const {object}
		 */
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