"use strict";

import { readdirSync } from "fs";

import petaliases from "./petaliases.js";

/**
 * Values that remain static and are used throughout the whole programme.
 * It is advised to take care when modifying this file.
 * @const {object}
 */
const Constants = {
	/**
	 * Array of owner IDs. These users always bypass all permission checks and have maximum bot access priviliges.
	 * @const {string[]}
	 */
	owners: ["501710994293129216", "D-757958112992034918"],
	/**
	 * The ID of the owner to display on every command (eg `Contact User#1234 for help!`, User#1234 would be the owner's tag).
	 * Default: owners[0]
	 * @const {string}
	 */
	get display() {
		return this.owners[0];
	},
	/**
	 * A list of command categories
	 * @const {string[]}
	 * @see help
	 */
	commandCategories: readdirSync(`${process.cwd()}/src/cmds`),
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
	 * Shown on embeds when the user does not have a custom preference set.
	 * @const {string}
	 */
	clr: "#00aaaa;0",
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
	cds: ["adrenc;dose adrenaline", "cfc;coinflip", "dialc;dial", "dlc;daily", "dpc;deprive", "dgrc;downgrade", "fdc;feed", "fishc;fish", "rbc;rob", "sntc;sentence", "sgstc;suggest", "srchc;search", "strc;stroke", "xpc;xp cooldown", "hlc;lowhigh cooldown"],
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
		/**
		 * The ID of the channel in which transactions are logged (transaction tracing, TT)
		 * @note GitHub issue #49
		 * @const {string}
		 */
		tt: "946894911909818368",
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
		 * The IDs of the `moderator` roles, which the exception of `srmod`, which has its own key.
		 * @property {string} trial - ID of the trial moderator role
		 * @property {string} normal - ID of the normal moderator role
		 * @const {object}
		 */
		mod: { trial: "912641359297511515", normal: "912641363944824832" },
		/**
		 * The ID of the role bound to the Rebel permission.
		 * @const {string}
		 */
		rebel: "912641468320088134",
		/**
		 * The ID of the role bound to the Sargent permission.
		 * @const {string}
		 */
		sarg: "912641474900946974",
		/**
		 * The ID of the staff role
		 * @deprecated
		 * @const {string}
		 */
		staff: "912641480890413056",
		/**
		 * The ID of the Citizen role.
		 * @const {string}
		 */
		cit: "912641662663131196",
		/**
		 * The ID of the role bound to the Colorist permission.
		 * @const {string}
		 */
		col: "912641555184123924",
		/**
		 * the ID of the role bound to the Supreme permission.
		 * @const {string}
		 */
		supreme: "912641563291713566",
		/**
		 * Not sure about this one, I'll fill out the comment for this later.
		 * @const {string}
		 * @deprecated
		 */
		warrior: "912641565346914304",
		/**
		 * The ID of the default role (I don't think that this is used anywhere)
		 * @deprecated
		 * @duplicate
		 */
		human: "912641644547936267",
		/**
		 * The ID of the role that all new members of the support server will receive upon joining.
		 * @const {string}
		 */
		memberRole: "912641644547936267",
		/**
		 * The ID of the muted role
		 * @see `mute`, `unmute`, `events/guildMemberAdd`
		 */
		muted: "912641654391988224",
		/**
		 * The ID of the Civilian role
		 * @const {string}
		 */
		civ: "912641353333211146",
		/**
		 * The bot developer role ID
		 * @const {string}
		 */
		botDeveloper: "912641730522783795",
		/**
		 * The ID of the senior moderator role.
		 * Controls ability to accept/deny staff applications
		 * @const {string}
		 */
		srmod: "912641369141559297",
	},
	/**
	 * An object consisting of the emojis which are used by the bot.
	 * With the exception of badge mojis; they have their own object.
	 * @const {object}
	 */
	emoji: {
		fish: ":fish:",
		dolphin: ":dolphin:",
		shark: ":shark:",
		blowfish: ":blowfish:",
		trop: ":tropical_fish:",
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
	/**
	 * An object consisting of colours used by the bot.
	 * @const {object}
	 */
	colors: {
		green: "#4bc46b",
		red: "#e61c1c",
		invisible: "#36393e",
		/**
		 * The colour that embeds will be changed to once they have expired.
		 * Typically something orange/red.
		 * @const {hexColourCode as String}
		 */
		expired: "#ff3c00",
	},
	/**
	 * Contains webhooks used by the bot.
	 * Debugger webhook receives informtion from the debug event.
	 * @const {object}
	 */
	webhooks: {
		debugger: "https://discord.com/api/webhooks/914286031325507584/rp7BIeS5RaZegZI3YzSfUlpyxASeA0dJfWC48O38fcaEe6EyH7LEAUxWY6mimmq0Ucyj",
	},
	/**
	 * Contains punishable offences in regard to `punish` and `unpunish` commands.
	 * @const {object}
	 */
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
	/**
	 * Contains information regarding all the different feedable foods. Check the `feed` command.
	 * @const {object}
	 */
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
	// getters. They all have to be in a getter in order to be able to successfully self-reference this object.
	/**
	 * A list of ditems, along with their corresponding role IDs, CSTs, and XP prices.
	 * @see `pbuy` and `ptransfer`
	 * @const {string[]}
	 */
	get ditems() {
		return [`b;businessman;${this.roles.businessman};9999999999999999`, `col;colorist;${this.roles.col};2500`, `judge;judge;${this.roles.judge};1000`, `nerd;nerd;${this.roles.nerd};500`, `reb;rebel;${this.roles.rebel};250`, `s;supreme;${this.roles.supreme};10000`, `upda;updates;${this.roles.updates};1`];
	},
	/**
	 * The "special" CSTs that also represent the presence of a certain role.
	 * They supplant their corresponding role IDs in a user's role persist data.
	 * This is done so it's just easier and quicker to determine whether or not a user has a valuable preconfigured role.
	 * @const {string[][]}
	 */
	get cstSpecials() {
		return [
			[ "kw", this.roles.kw ],
			[ "judge", this.roles.judge ],
			[ "businessman", this.roles.businessman ],
			[ "nerddd", this.roles.nerd ],
			[ "civilian", this.roles.civilian ],
			[ "muted", this.roles.muted ],
			[ "rebel", this.roles.rebel ],
			[ "supreme", this.roles.supreme ],
			[ "colorist", this.roles.col ],
			[ "tmod", this.roles.mod.trial ],
			[ "moderator", this.roles.mod.normal ],
			[ "srmod", this.roles.srmod ],
			[ "citizen", this.roles.cit ],
			[ "updt", this.roles.updates ],
		];
	},
	/**
	 * The different pet aliases,  imported from `Utils/petaliases.js`.
	 * Attached to client.
	 * @const {object}
	 */
	petaliases,
	/**
	 * Look-up-table used to convert a string to a math operator function
	 * @see `cmds/economy/lowhigh.js`
	 * @const {object}
	 */
	mathOps: {
		">": function(x, y) {return x > y;},
		"<":  function(x, y) {return x < y;},
		"===": function(x, y) {return x === y;},
	},
	/**
	 * An object which contains messages that a user will receive if they do not possess the certain CST the key represents.
	 * For example, `"mod": "You're not a mod!"` means that if a command with cst requirement `mod` is run, and the user
	 * does not posseess the `mod` cst, then the message `"You're not a mod!"` will be displayed.
	 * @issue #43
	 * @const {object}
	 */
	cstMessages: {
		administrator132465798: "You must be a bot administrator in order to use this command!",
		bvault: "You must own a bank vault in order to use this command! Take a look in `<Prefix>shop` to view more information",
		dragon: "You must own a dragon in order to use this command! You may purchase one by using `<Prefix>tame`",
		fishrod: "You must own a fishing rod in order to use this command! Take a look in `<Prefix>shop` and purchase one",
		judge: "You must be a judge in order to use this command!",
		moderator: "You must be a moderator in order to use this command!",
		qts: "You really thought that you were cool enough to use this command?",
		slrprmt: "You must be a own a seller's permit in order to sell items! Take a look in `<Prefix>shop` for more information",
		srmod: "You must be a senior moderator in order to use this command!",
		supreme: "You must have the SUPREME permission in order to use this command!",
	},
	/**
	 * An array consisting of purchaseable items.
	 * @type {Array<record<{ categoryName: string, items: Array<record<{ ID: number, DISPLAY_NAME: string, DESCRIPTION: string, CST: string | null, EMOJI: string, SELLABLE: boolean, PRICE: number, CD: number | null, POTENCY: number | null }>> }>>}
	 */
	get shopItems() {
		return [
			{
				categoryName: "General",
				// was previously named "shopItems" but later changed to just "items"
				// to prevent confusion
				items: [
					{
						ID: 1,
						DISPLAY_NAME: "Fishing Rod",
						DESCRIPTION: "Allows you to go fishing via `<Prefix>fish`",
						CST: "fishrod",
						EMOJI: this.emoji.fishing_rod,
						SELLABLE: true,
						PRICE: 25,
						// no cooldown here as there is a command cooldown on the fish command globally
						CD: null,
					},
					{
						ID: 2,
						DISPLAY_NAME: "The Seller's Permit",
						DESCRIPTION: "Allows you to sell certain in-game items via `<Prefix>sell` for a neat profit",
						CST: "slrprmt",
						EMOJI: this.emoji.slrprmt,
						SELLABLE: false,
						PRICE: 25,
						CD: null,
					},
				],
			},
			{
				categoryName: "Consumables/Drugs",
				items: [
					{
						ID: 101,
						DISPLAY_NAME: "Chill Pill",
						DESCRIPTION: "removes all cooldowns, 6 hour cooldown for consuimg this item; consume with `<Prefix>dose chill`",
						CST: null,
						INDX: 0,
						EMOJI: this.emoji.chill,
						SELLABLE: true,
						PRICE: 25,
						// 6h
						CD: 21600000,
						CDK: "chillc",
						async executeUponDose(user, data, message) {
							const obj = {};
							// here, "this.cds" could not be used, as the this scope changed.
							// instead, we use an alternate route:
							message.client.const.cds.forEach(async (c) => {
								c = c.split(";")[0];
								obj[c] = null;
							});
							await message.client.db.USERS.update(obj, { where: { id: user.id } });
						},
					},
					{
						ID: 102,
						DISPLAY_NAME: "Adrenaline",
						DESCRIPTION: "Inject yourself with this energizing hormone! Enter either a `<Prefix>fight` or `<Prefix>flight` state!",
						CST: null,
						INDX: 1,
						EMOJI: this.emoji.adrenaline,
						SELLABLE: true,
						PRICE: 25,
						// 90m, 1.5hr
						CD: 5400000,
						// how long the affects of this drug will last
						// 30m, .5 hr
						POTENCY: 1800000,
						CDK: "adrnc",
					},
					{
						ID: 103,
						DISPLAY_NAME: "Fish",
						DESCRIPTION: "Obtain via `<Prefix>fish`, can be sold or collected for bragging rights",
						CST: null,
						INDX: 2,
						EMOJI: this.emoji.fish,
						SELLABLE: true,
						PRICE: 25,
						CD: null,
						POTENCY: null,
					},
					{
						ID: 104,
						DISPLAY_NAME: "Tropical Fish",
						DESCRIPTION: "Obtain via `<Prefix>fish`, can be sold or collected for bragging rights",
						CST: null,
						INDX: 3,
						EMOJI: this.emoji.trop,
						SELLABLE: true,
						PRICE: 25,
						CD: null,
						POTENCY: null,
					},
					{
						ID: 105,
						DISPLAY_NAME: "Shark",
						DESCRIPTION: "Obtain via `<Prefix>fish`, can be sold or collected for bragging rights",
						CST: null,
						INDX: 4,
						EMOJI: this.emoji.shark,
						SELLABLE: true,
						PRICE: 25,
						CD: null,
						POTENCY: null,
					},
					{
						ID: 106,
						DISPLAY_NAME: "Blowfish",
						DESCRIPTION: "Obtain via `<Prefix>fish`, can be sold or collected for bragging rights",
						CST: null,
						INDX: 5,
						EMOJI: this.emoji.blowfish,
						SELLABLE: true,
						PRICE: 25,
						CD: null,
						POTENCY: null,
					},
					{
						ID: 107,
						DISPLAY_NAME: "Dolphin",
						DESCRIPTION: "Obtain via `<Prefix>fish`, can be sold or collected for bragging rights",
						CST: null,
						INDX: 6,
						EMOJI: ":dolphin:",
						SELLABLE: true,
						PRICE: 25,
						CD: null,
						POTENCY: null,
					},
				],
			},
			{
				categoryName: "Utils",
				items: [
					{
						ID: 201,
						DISPLAY_NAME: "Bank Vault",
						DESCRIPTION: "Allows you to store money where it's safely hidden away from attackers; `<Prefix>vault` to view your vault",
						CST: "bvault",
						EMOJI: this.emoji.bvault,
						SELLABLE: true,
						PRICE: 10_000,
						CD: null,
					},
					{
						ID: 202,
						DISPLAY_NAME: "Random Colour Preference",
						DESCRIPTION: "Set a random colour preference whilst using commands (different each time)",
						CST: "rc",
						EMOJI: this.emoji.rc,
						SELLABLE: true,
						PRICE: 500,
						CD: null,
					},
				],
			},
		];
	},
};

/** @exports Constants */
export { Constants };