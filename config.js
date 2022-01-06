"use strict";
import pkg from "discord.js";
// eslint-disable-next-line no-unused-vars
const { PresenceData, Client, Channel, ChannelManager, User, Collection, MessageEmbed, DiscordAPIError, MessagePayload, Message } = pkg;
import aliases from "./petaliases.js";
import { readdirSync } from "fs";
import { inspect } from "util";


/**
 * @classdesc These are some default functions. They have been globalised in such manner by purpose, as these functions are **__constantly__** in use by the programme, thus I deemed it more effecient to have one globalised class to manage and export functions.
 * @class @public
 */
class Funcs {
	/**
	 * @constructor
	 * @param {Client} client The currently instantiated Discord client.
	 */
	constructor(client) {
		/**
		 * The currently instantiated client.
		 * @static @readonly
		 */
		this.client = client;
	}
	/**
	 * Capitalises the first letter of the given string and returns the new string. Only the first letter is capitalised.
	 * @param {String} str string to be capitalised
	 * @returns {String} capitalised string
	 * @method
	 */
	capital(str) {
		return str[0].toUpperCase() + str.slice(1);
	}
	/**
	 * Shows element in inspcted format
	 * @param {any} element Element to be inspected
	 * @param {number} pen Specifies the number of times to recurse while formatting object. This is useful for inspecting large objects. To recurse up to the maximum call stack size pass Infinity or null. Default: 2. (source: https://nodejs.org/api/util.html#utilinspectobject-showhidden-depth-colors)
	 * @returns {string}
	 */
	Inspect(element, pen = 2) {
		return inspect(element, { depth: isNaN(pen) ? 2 : Number(pen) });
	}
	/**
	 * Extracts the ID of a mentioned user from its raw content
	 * ID is not capitalised in order to keep it in line with Discord.js' naming conventions.
	 * @param {String} mention String to extract mention ID from
	 */
	getId(mention) {
		if (!mention) return;
		return mention.match(/^<@!?(\d+)>$/)[1];
	}
	/**
		 * Fetches a Discord User
		 * @param {String} str The mention - either ID or raw <@(!)id>
		 * @returns {User} Discord.User
		 * @async
		 */
	async fetchUser(str) {
		if (!str) return;
		str = str.toString();
		let usr;
		try {
			usr = await this.client.users.fetch(this.getId(str));
		}
		catch (err) {
			// eslint-disable-next-line no-unused-vars
			usr = await this.client.users.fetch(str).catch(() => {return;});
		}
		return usr;
	}
	/**
	 * Inserts comma to a string; acts as a thousands separator
	 * @param {string} x String in which to insert commas.
	 */
	comma(x = 0) {
		return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
	}
	/**
	 * Applies digit trimming to a `str` instance
	 * @param {number} bal String to show digits; may be str instance but not NaN
	 * @returns {string}
	 */
	digits(bal = 0) {
		bal = bal.toString();
		if (!bal || (bal == "0")) return "0";
		bal = String(bal).toLowerCase().replace("+", "").replace("-", "");
		if (bal.includes("e")) {
			if (isNaN(bal.split("e")[1])) {
				return this.comma(bal);
			}
			let digits = Number(bal.split("e")[1]);
			digits -= 15;
			if (digits <= 0) {
				return this.comma(bal);
			}
			return `${this.comma(bal.split("e")[0].replace(".", "") + "0".repeat(20 - bal.split("e")[0].replace(".", "").length))}... [${digits} digits]`;
		}
		else {
			return this.comma(bal);
		}
	}
	/**
	 * This function will add hyphens to a string every X characters; view [the article type thingy](https://repl.it/talk/share/Insert-Hyphens-in-JavaScript-String/50244) for additional information.
	 * @param {string} str The string to hyphenify
	 * @param {number} interval The interval of which to add hyphens to the string
	 * @param {object} options Options to be applied.
	 * @param {boolean} [options.removeWhiteSpaces] Whether or not to remove whitespaces in the string
	 * @param {boolean} [options.includeNewLine] Whether or not to include & register the newline character (`\n`) as a part of the string.
	 * @returns {string} String<hyphenified> Hyphenified String
	 */
	hyphen(str, interval = 1, options = { removeWhiteSpaces: true, includeNewLine: false }) {
		if (typeof options !== "object") {
			throw new TypeError("options must be of type object");
		}
		if (!str) return null;
		interval = Number(interval);
		if (isNaN(interval)) throw new TypeError(`Interval msut be of type Number. Received type : ${typeof interval}`);
		str = str.toString();
		if (options.removeWhiteSpaces) {
			// remove whitespaces:
			str = str.replace(/ +/g, "");
		}
		let matches;
		if (options.includeNewLine) {
			matches = str.match(new RegExp(".{1," + interval + "}", "gs"));
		}
		else {
			matches = str.match(new RegExp(".{1," + interval + "}", "g"));
		}
		if (!matches) return null; else return matches.join("-");
	}
	/**
	 * Calculates the cooldown and returns a mesage.
	 * @param {Date} now
	 * @param {Date} future when the "cooldown" is to be lifted
	 * @param {Boolean} ws Whether or not to include seconds in the returned cooldown message even if there are X minutes left.
	 * @returns {String} message containing cooldown information
	 */
	cooldown(now, future, ws = false) {
		now = Number(now);
		future = Number(future);
		// if there's no cooldown, return false and exit function (just makes it faster):
		if (((now - future) / 100) >= 0) return false;
		let d = Math.abs(now - future) / 1000;
		let r = {};
		const s = {
			years: 31536000,
			months: 2592000,
			weeks: 604800,
			days: 86400,
			hours: 3600,
			minutes: 60,
			seconds: 1,
		};
		Object.keys(s).forEach((key) => {
			r[key] = Math.floor(d / s[key]);
			d -= r[key] * s[key];
		});
		r = Object.entries(r).filter((x) => x[1] > 0);
		if (r.length < 1) return false;
		if (r.length > 1 && (!ws)) r = r.filter((x) => x[0] != "seconds");
		if (r.length == 2) return `${r[0][1]} ${r[0][0]} and ${r[1][1]} ${r[1][0]}`;
		function ls(arr) {
			return arr.map((elmt) => arr.indexOf(elmt) == (arr.length - 1) ? `and ${elmt}` : elmt);
		}
		// Property 'length' does not exist on type '{}'.ts(2339)
		// ignore ts(2339) error; this shouldn't be popping up for plain JS files. Microsoft, you need to up your game! (I am using VSC as my IDE)
		return r.length >= 2 ? ls(r.map((x) => `${x[1]} ${x[1] == 1 ? x[0].slice(0, -1) : x[0]}`)).join(", ") : r.map((g) => `${g[1]} ${g[1] == 1 ? g[0].slice(0, -1) : g[0]}`).join(", ");
	}
	/**
	 * Removes the exponent ("E") on numbers expressed in scientific notation
	 * @param {Number} x Number that is to be expanded.
	 * @returns {String}
	 */
	noExponents(x) {
		if (isNaN(x)) return "0";
		const data = String(Number(x)).split(/[eE]/);
		if (data.length == 1) return data[0];

		const sign = x < 0 ? "-" : "";
		const str = data[0].replace(".", "");

		let z = "";
		let mag = Number(data[1]) + 1;
		if (mag < 0) {
			z = sign + "0.";
			while (mag++) z += "0";
			return z + str.replace(/^-/, "");
		}
		mag -= str.length;
		while (mag--) z += "0";
		return str + z;
	}
	/**
	 * Stuns a user whilst performing required validatory actions beforehand
	 * @param {Object} opts Options for the stun
	 * @param {String} [opts.userId] Snowflake ID of the user who must be stunned
	 * @param {Number} [opts.minutes] Amount of minutes for which the user is stunned
	 * @param {String} [opts.stnb] Stnb value (You can't do anything while you're {stnb}!)
	 * @returns {void} void
	 * @async @method
	 */
	async stn(opts) {
		const user = await this.client.users.fetch(opts.userId).catch(() => {return;});
		if (!user) return;
		const data = await this.client.db.getUserData(opts.userId);
		const dns = (isNaN(data.get("dns")) ? 0 : Number(data.get("dns"))) * 60_000;
		if (dns && (Date.now() < dns)) return;
		await this.client.db.USERS.update({
			stn: Math.trunc((Date.now() / 60_000) + opts.minutes),
			stnb: opts.stnb,
		}, {
			where: {
				id: opts.userId,
			},
		});
		return undefined;
	}
	/**
	 * Converts normal string text into binary text.
	 * @param {String} text Text to convert into binary.
	 * @returns {String} string of binary digits
	 */
	text2Binary(text) {
		return text.split("").map((char) => {
			return char.charCodeAt(0).toString(2);
		}).join(" ");
	}
	/**
	 * Converts a normal array to a 2d array of optional number of subvalues.
	 * @param {Any[]} list Original 1d array
	 * @param {Number} elementsPerSubArray Number of elements per subArray
	 * @returns {Any[]} matrix matrix (the new array)
	 */
	listToMatrix(list, elementsPerSubArray) {
		const matrix = [];
		let i, k;
		for (i = 0, k = -1; i < list.length; i++) {
			if (i % elementsPerSubArray === 0) {
				k++;
				matrix[k] = [];
			}
			matrix[k].push(list[i]);
		}
		return matrix;
	}
	/**
	 * Used for moving elements around in arrays.
	 * @param {Array<Any} arr Original list
	 * @param {number} old_index index of old item
	 * @param {number} new_index new index of item
	 * @returns {Array<Any>}
	 */
	arrayMove(arr, old_index, new_index) {
		if (new_index >= arr.length) {
			const k = new_index - arr.length + 1;
			// eslint-disable-next-line no-const-assign
			while (k--) {
				arr.push(undefined);
			}
		}
		arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
		return arr;
	}
	/**
	 * Maps the array into a list, in the form of a sentence.
	 * @example ["a", "b", "c"] gives "a, b, and c" (which is also grammatically correct)
	 * @param {Array<String>} arr array to be listed
	 * @returns {string}
	 */
	list(arr) {
		return arr.map((x) => arr.length > 1 ? (arr.indexOf(x) == arr.length - 1 ? `and \`${x}\`` : `\`${x}\``) : `\`${x}\``).join(", ");
	}
	/**
	 * Returns a random number between the two endpoints, r.
	 * @param {number} min minimum value of r
	 * @param {number} max maximum value of r
	 * @returns {number}
	 */
	getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	/**
	 * Parses a cooldown amount.
	 * Preps cooldown value then sets it. Not complicated.
	 * @param {Date} now Current MS timestamp
	 * @param {number} cd Cooldown to add (in MS)
	 * @param {boolean} includeDecimals Whether or not to include decimals into the date returned
	 * @returns {Date} Date at which the cooldown will end --- in MS
	 */
	parseCd(now, cd, includeDecimals = false) {
		if (includeDecimals == true) {
			return parseFloat(((now + cd) / 60_000)).toFixed(2);
		}
		else {
			return Math.trunc(((now + cd) / 60_000));
		}
	}
	/**
	 * This function will allow you to trim a string such that it does not exceed the provided `max` length.
	 * @param {string} str The string which is to be trimmed.
	 * @param {number} max The maximum amount of chars that the string passed into this function cannot exceed.
	 * @param {boolean} dots If exceeded, then this param allows for you to control whether or not you"d like 3 dots to replace the last 3 chars of the string.
	 * @returns {str} Trimmed string (if trimmed, then string is returned with '...' appended)
	 */
	trim(str = "", max, dots = true) {
		if (!max) return str;
		if (str.length > max) {
			return `${str.slice(0, max - 3)}${dots ? "..." : ""}`;
		}
		else {
			return str;
		}
	}
	/**
	 * This function will cache all the commands in `dir`, therefore making them usable.
	 * @param {string} dir Directory of which to load commands from
	 * @param {Collection<K, V>} clientCommands client.config.commands collection - loads commands into this collection
	 * @returns {Array<Boolean, Collection<ommand.name, command>> | Error}
	 */
	// (method) Funcs.cacheCommands(dir: string, clientCommands: Collection<K, V>): Array<boolean, Collection<cmd.name, cmd>> | Error
	async cacheCommands(dir, clientCommands) {
		let cmds = 0;
		try {
			for (const file of readdirSync(dir).filter((f) => f.endsWith(".js"))) {
				const command = await import(`${dir}/${file}`);
				clientCommands.set(command.default.name, command.default);
				cmds++;
			}
			return [true, cmds];
		}
		catch (err) {
			throw new Error(`[CLIENT => Process] [CommandCacheError]:\n${err.stack}`);
		}
	}
	/**
	 * This function will get the display name and the emojis for a user"s dragon alias.
	 * * Each user can have their own dragon alias (of course, I would have to add it to `petaliases.json` for it to be registered as such).
	 * * An "alias" allows a user to replace the "dragon" for anything else, as well as allowing them to choose custom emojis for their stats on their dragon. In the latter parts of the bot, there is a system that will allow users to give/take access of the alias from people.
	 * * Users are able to do `~dragonalias` to see a list of their aliases, indexed. They will then do `~dragonalias <index>`, replacing `<index>` with the index of their choice, which means that the bot will switch their alias to whatever they had chosen.
	 * @param {string} uid The ID of a Discord user whose dragon alias is to be fetched
	 * @returns {Array<string, string[]>}
	 * @async @method
	 */
	async getDragonAlias(uid, client) {
		if (client) console.warn("DeprecationWarning: client passed into getDragonAlias function when not necessary.");
		const data = await this.client.db.getUserData(uid);
		const currAlias = data.get("crls") || "default";
		if (currAlias) {
			const petname = data.get("petname") || "dragon";
			const names = Object.keys(aliases).map((key) => key.toLowerCase());
			if (names.includes(currAlias)) {
				// petname takes priority over alias.DISPLAY_NAME, gives users more freedom.
				return [petname || aliases[currAlias].DISPLAY_NAME, aliases[currAlias].EMOJIS];
			}
			else {
				return [petname || "dragon", ["<:heart:912982056802340877>", ":zap:", ":star2:", ":star:", ":bulb:", ":field_hockey:", ":fire:", ":sparkling_heart:", ":pizza:" ]];
			}
		}
	}
	/**
	 * The function will DM a user in context of a (gameplay) command.
	 * @param {object} opts Options
	 * @param {string} [opts.userId] ID of the user to DM. It is named userId for consistency
	 * @param {Message} [opts.message] Object that should be passed into `<TextBasedChannel>.send()`method.
	 * @param {?Channel} [opts.channel] Optional channel to also send the message in
	 * @returns {void} void
	 * @async @method
	 */
	async dm(opts) {
		if (!opts.message || !opts.userId) throw new TypeError("opts.message or opts.userId are null/missing.");
		const user = await this.client.users.fetch(opts.userId).catch(() => {return;});
		if (!user) return;
		const data = await this.client.db.getUserData(opts.userId);
		if (opts.channel) opts.channel.send(opts.message);
		if (data.get("cst")?.split(";").includes("dnd")) return;
		user.send(opts.message).catch(() => {return;});
	}
	/**
	 * Updates the client presence
	 * @param {PresenceData} presence Data for presence to be passed into `client#user#presence#set` method
	 * @param {boolean} useDefault Whether or not to use the client's "default" presence data (use this for updating guild count) [Default: false]
	 * @returns {void} void
	 */
	updatePresence(presence, useDefault = false) {
		if (useDefault == true) {
			this.client.user.presence.set({
				activities: [{
					name: `${this.client.guilds.cache.size} servers | ~support to join our support server for free 💵 500`,
					type: "WATCHING",
				}],
				status: "dnd",
			});
		}
		else {
			this.client.user.presence.set(presence);
		}
	}
	/**
 * * Used to send an error to the exceptions channel. (This is also sent to the console.)
 * * The function name is capitalised in order to prevent me from overusing it (yeah, I'm that lazy)
 * * This function was not able to go in the `config.js` file due to certain complications
 * @param {String} e exception that is to be recorded
 * @param {?String} msgCont message content (only if this was used in a command - really helps with debugging)
 */
	Notify(e, msgCont) {
		const rn = new Date().toISOString();
		console.error(e);
		if (!msgCont || msgCont.toString().length == 0) {
			this.client.channels.cache.get(this.client.config.statics.defaults.channels.error).send({
				content: `[${rn}]: <type: unhandledRejection>:\n\`${e}\``,
			// very unliekly that a normal exception/error will exceed 2,000 characters in length.
			}).catch(() => {return;});
		// to prevent messageSendFailure erros from throwing. They flood the console and often I can't do anything about it so it's better to just ignore those.
		}
		else {
			this.client.channels.cache.get(this.client.config.statics.defaults.channels.error).send({
				content: `[${rn}]: <type: unhandledRejection>:\n\`${e}\``,
				embeds: [
					new MessageEmbed()
						.setColor("#da0000")
						.setDescription(msgCont instanceof Promise ? "Promse { <rejected> }" : msgCont.toString() || "Message content unavailable."),
				],
			})
				.catch(() => {return;});
		}
	}

}

// static values
const config = {
	ssInvite: "https://discord.gg/",
	supportServer: "911784758600679455",
	prefix: "~",
	botInvite: "https://discord.com/oauth2/authorize?client_id=671708767813107724&scope=bot&permissions=67456065",
	dailyReward: 5_000,
	upgr: ["int;intellect;5", "end;endurance;6", "str;strength;7", "gl;glycogenesis;9"],
	// following doubles each time, so it becomes harder for users to level up their dragon as their dragon becomes a higher level (and thus a higher requirement of XP to level up once more). These values were previously determined by an algorithm, however I deemed it faster in the ling run to just have them hard-coded. It saves processing time too, albeit not much, but it can help the bot catch up if there are loads of incompleted requests.
	reqs: [400, 800, 1600, 3200, 6400, 12800, 25600, 51200, 102400, 204800, 409600, 819200, 1638400, 3276800, 6553600, 13107200, 26214400, 52428800, 104857600, 209715200, 419430400, 838860800, 1677721600, 3355443200, 6710886400, 13421772800, 26843545600, 53687091200, 107374182400, 214748364800, 429496729600, 858993459200, 1717986918400, 3435973836800, 6871947673600, 13743895347200, 27487790694400, 54975581388800, 109951162777600, 219902325555200, 439804651110400, 879609302220800, 1759218604441600, 3518437208883200, 7036874417766400, 14073748835532800, 28147497671065600, 56294995342131200, 112589990684262400, 225179981368524800],
	PET_EMOJIS: [ "<:heart:912982056802340877>", ":zap:", ":star2:", ":star:", ":bulb:", ":field_hockey:", ":fire:", ":sparkling_heart:", ":pizza:" ],
	defaults: {
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
	},
};

config.ditems = [`b;businessman;${config.defaults.roles.businessman};9999999999999999`, `col;colorist;${config.defaults.roles.col};2500`, `judge;judge;${config.defaults.roles.judge};1000`, `nerd;nerd;${config.defaults.roles.nerd};500`, `reb;rebel;${config.defaults.roles.rebel};250`, `s;supreme;${config.defaults.roles.supreme};10000`, `upda;updates;${config.defaults.roles.updates};1`];

config.cstSpecials = [
	[ "kw", config.defaults.roles.kw ],
	[ "judge", config.defaults.roles.judge ],
	[ "businessman", config.defaults.roles.businessman ],
	[ "nerddd", config.defaults.roles.nerd ],
	[ "civilian", config.defaults.roles.civilian ],
	[ "muted", config.defaults.roles.muted ],
	[ "rebel", config.defaults.roles.rebel ],
	[ "supreme", config.defaults.roles.supreme ],
	[ "colorist", config.defaults.roles.col ],
	[ "tmod", config.defaults.roles.mod.trial ],
	[ "moderator", config.defaults.roles.mod.normal ],
	[ "srmod", config.defaults.roles.srmod ],
	[ "citizen", config.defaults.roles.cit ],
	[ "updt", config.defaults.roles.updates ],
];

config.shop = {
	fishrod: {
		displayName: "Fishing rod",
		id: 1,
		emoji: config.defaults.emoji.fishing_rod,
		description: "Allows you to go fishing via `~fish`",
		price: 250,
		method: "cst",
		condt: null,
	},
	slrprmt: {
		displayName: "The Seller's Permit",
		id: 2,
		emoji: config.defaults.emoji.slrprmt,
		description: "Allows you to sell in-game items via `~sell`",
		price: 50_000,
		method: "cst",
		condt: null,
	},
	chillpills: {
		displayName: "1x Chill Pill",
		id: 101,
		emoji: config.defaults.emoji.chill,
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
		emoji: config.defaults.emoji.chill,
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
		emoji: config.defaults.emoji.bvault,
		description: "Allows you to store money where it's safely hidden away from robbers; `~vault` to view your vault",
		price: 25_000,
		condt: null,
	},
	rc: {
		displayName: "Random Colour Preference",
		id: 202,
		emoji: config.defaults.emoji.rc,
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

config.doses = [
	[ `ch;chillpill;1;chillc;6h;${config.defaults.emoji.chill}`, (async (message) => {
		const x = await message.client.db.get(`chillpills${message.author.id}`) || 0;
		if (Number(x) == 0) {
			return message.reply(`${config.defaults.emoji.chill} You don"t have any chill pills!`);
		}
		await message.client.db.set(`chillpills${message.author.id}`, Number(x - 1));
		config.defaults.cds.forEach(async (c) => {
			c = c.split(";")[0];
			await message.client.db.delete(c + message.author.id);
		});
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has consumed a ${message.client.config.statics.defaults.emoji.chill} and cleared all of their cooldowns!`),
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

class ClientConfiguration extends Funcs {
	constructor(client) {
		super(client);
		this.client = client;
		this.owner = "501710994293129216";
		// this.owner = "504619833007013899";
		this.statics = config;
	}
}

export { ClientConfiguration };