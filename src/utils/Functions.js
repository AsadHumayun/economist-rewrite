import { MessageEmbed } from "discord.js";
import { readdirSync } from "fs";
import { inspect } from "util";

import aliases from "./petaliases.js";

/**
 * @classdesc These are some default functions. They have been globalised in such manner by purpose, as these functions are **__constantly__** in use by the programme, thus I deemed it more effecient to have one globalised class to manage and export functions.
 * @class @public
 */
class Funcs {
	/**
	 * @constructor
	 * @param {Discord.Client} client The currently instantiated Discord client.
	 */
	constructor(client) {
		/**
		 * The currently instantiated Discord client.
		 * @type {Discord.Client}
		 */
		this.client = client;
	}
	/**
	 * Capitalises the first letter of the given string and returns the new string. Only the first letter is capitalised.
	 * @param {string} str string to be capitalised
	 * @returns {string} capitalised string
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
	 * @param {string} mention String to extract mention ID from
	 */
	getId(mention) {
		if (!mention) return;
		return mention.match(/^<@!?(\d+)>$/)[1];
	}
	/**
	 * Fetches a Discord User either by ID or raw mention
	 * @param {string} str The mention - either ID or raw <@(!)id>
	 * @returns {Discord.User} Discord user
	 */
	async fetchUser(str) {
		if (!str) return;
		str = str.toString();
		let usr;
		try {
			usr = await this.client.users.fetch(this.getId(str));
		}
		catch (err) {
			usr = await this.client.users.fetch(str).catch(() => {return;});
		}
		return usr;
	}
	/**
	 * Inserts comma to a string; acts as a thousands separator
	 * @param {?string} x String in which to insert commas.
	 */
	comma(x) {
		return x ? this.noExponents(x.toString()).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") : "0";
	}
	/**
	 * Applies digit trimming to a `str` instance
	 * @param {string} bal String to show digits; must be in standardised number format
	 * @param {?number} maximumLen The maximum length of the string to be brought down (or brought up) to this integer. Default: 18
	 * @returns {string}
	 */
	digits(bal, maximumLen = 18) {
		if (typeof bal !== "string") bal = this.format(bal);
		const BAL = bal;
		if (this.expand(bal) === 0n) return "0";

		bal = bal.split("&");
		if (!bal[1]) bal[1] = 0;
		bal[1] = Number(bal[1]);

		const combinedLength = bal[0].length + bal[1];
		if (combinedLength <= maximumLen) return this.comma(this.expand(BAL));
		if (bal[0].length >= maximumLen) return `${this.comma(bal[0].slice(0, maximumLen))}... (${(bal[0].length + bal[1]) - maximumLen} digits)`;

		const zeros = "0".repeat(maximumLen - bal[0].length);
		return `${this.comma(bal[0] + zeros)}... (${this.expand(`${bal[0]}&${bal[1]}`).toString().length - maximumLen} digits)`;
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
	 * @param {?boolean} ws Whether or not to include seconds in the returned cooldown message even if there are X minutes left.
	 * @returns {string} message containing cooldown information
	 */
	cooldown(now, future, ws = false) {
		now = BigInt(now);
		future = BigInt(future);
		// if there's no cooldown, return false and exit function (just makes it faster):
		if (((now - future) / 100n) >= 0n) return false;
		let d = BigInt(String(now - future).replace("-", "")) / 1000n;
		let r = {};
		const s = {
			years: 31536000n,
			months: 2592000n,
			weeks: 604800n,
			days: 86400n,
			hours: 3600n,
			minutes: 60n,
			seconds: 1n,
		};
		Object.keys(s).forEach((key) => {
			r[key] = BigInt(String(d / s[key]).split(".")[0]);
			d -= r[key] * s[key];
		});
		r = Object.entries(r).filter((x) => x[1] > 0n);
		if (r.length < 1) return false;
		if (r.length > 1 && (!ws)) r = r.filter((x) => x[0] != "seconds");
		if (r.length == 2) return `${r[0][1]} ${r[0][0]} and ${r[1][1]} ${r[1][0]}`;
		// Property 'length' does not exist on type '{}'.ts(2339)
		// ignore ts(2339) error; this shouldn't be popping up for plain JS files. Microsoft, you need to up your game! (I am using VSC as my IDE)
		return r.length >= 2 ? this.list(r.map((x) => `${x[1]} ${x[1] == 1 ? x[0].slice(0, -1) : x[0]}`)) : r.map((g) => `${g[1]} ${g[1] == 1 ? g[0].slice(0, -1) : g[0]}`);
	}
	/**
	 * Removes the exponent ("E") on numbers expressed in scientific notation
	 * @param {?bigint} x Number that is to be expanded.
	 * @returns {string}
	 */
	noExponents(x = 0n) {
		if (isNaN(Number(x))) return "0";
		const data = String(x).split(/[eE]/);
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
	 * @param {object} opts Options for the stun
	 * @param {string} [opts.userId] Snowflake ID of the user who must be stunned
	 * @param {bigint} [opts.minutes] Amount of minutes for which the user is stunned
	 * @param {?string} [opts.stnb] Stnb value (You can't do anything while you're {stnb}!)
	 * @returns {void} void
	 * @async
	 */
	async stn({ userId, minutes, stnb }) {
		const user = await this.client.users.fetch(userId).catch(() => {return;});
		if (!user) return;
		const data = await this.client.db.getUserData(userId);
		const dns = (isNaN(data.get("dns")) ? BigInt(0) : BigInt(data.get("dns"))) * BigInt(60_000);
		if (dns && (Date.now() < dns)) return;
		await this.client.db.USERS.update({
			stn: String((BigInt(Date.now()) / BigInt(60_000)) + BigInt(minutes)).split(".")[0],
			stnb,
		}, {
			where: {
				id: userId,
			},
		});
	}
	/**
	 * Converts normal string text into binary text.
	 * @param {string} text Text to convert into binary.
	 * @returns {string} string of binary digits
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
	 * @param {Any[]} arr Original list
	 * @param {number} old_index index of old item
	 * @param {number} new_index new index of item
	 * @returns {Any[]}
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
	 * @param {string[]} arr array to be listed
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
	 * @param {?boolean} includeDecimals Whether or not to include decimals into the date returned
	 * @returns {Date} Date at which the cooldown will end --- in MS
	 */
	parseCd(now,
	 cd, includeDecimals = false) {
		now = Number(now);
		cd = Number(cd);
		if (includeDecimals == true) {
			return (parseFloat(((now + cd) / 60_000))).toFixed(2);
		}
		else {
			return (Math.trunc(((now + cd) / 60_000)));
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
	 * @param {Discord.Collection<K, V>} clientCommands client.commands collection - loads commands into this collection
	 * @returns {number | Error}
	 */
	async cacheCommands(dir, clientCommands) {
		dir = `${process.cwd()}${dir}`;
		const subFolders = readdirSync(dir);
		if (!subFolders) throw new RangeError(`[utils => CommandsCache] [Fail]: No subfolders found in directory, open '${dir}'.`);
		let cmds = 0;
		// subFolders' names act as the command's category name.
		for (const folder of subFolders) {
			for (const file of readdirSync(`${dir}/${folder}`).filter(f => f.endsWith(".js"))) {
				try {
					const { default: command } = await import(`file://${dir}/${folder}/${file}`);
					command.category = folder;
					clientCommands.set(command.name, command);
					cmds++;
				}
				catch (err) {
					throw new Error(`[CLIENT => Fncs] [CommandCacheError] (on '${dir}/${folder}/${file}'):\n${err.stack}`);
				}
			}
		}
		return cmds;
	}
	/**
	 * This function will get the display name and the emojis for a user's dragon alias.
	 * * Each user can have their own dragon alias (of course, I would have to add it to `petaliases.json` for it to be registered as such).
	 * * An "alias" allows a user to replace the "dragon" for anything else, as well as allowing them to choose custom emojis for their stats on their dragon. In the latter parts of the bot, there is a system that will allow users to give/take access of the alias from people.
	 * * Users are able to do `~dragonalias` to see a list of their aliases, indexed. They will then do `~dragonalias <index>`, replacing `<index>` with the index of their choice, which means that the bot will switch their alias to whatever they had chosen.
	 * @param {string} uid The ID of a Discord user whose dragon alias is to be fetched
	 * @returns {Array<string, string[]>}
	 * @async
	 */
	async getDragonAlias(uid, client) {
		if (client) process.logger.warn("DEPRECATION", "client passed into getDragonAlias function when not necessary.");
		const data = await this.client.db.getUserData(uid);
		let currAlias = data.get("curr")?.toLowerCase() || "default";
		const aliasMap = Object.keys(aliases).map(k => k.toLowerCase());
		if (!aliasMap.includes(currAlias)) currAlias = "default";
		const petname = data.get("petname");
		// petname takes priority over alias.DISPLAY_NAME, gives users more freedom.
		return [petname || aliases[currAlias].DISPLAY_NAME, aliases[currAlias].EMOJIS];
	}
	/**
	 * The function will DM a user in context of a (gameplay) command.
	 * @param {object} opts Options
	 * @param {string} [opts.userId] ID of the user to DM. It is named userId for consistency
	 * @param {Discord.Message} [opts.message] Object that should be passed into `<TextBasedChannel>.send()`method.
	 * @param {?Discord.TextChannel} [opts.channel] Optional channel to also send the message in
	 * @returns {void} void
	 * @async
	 */
	async dm(opts) {
		if (!opts.message || !opts.userId) throw new TypeError("opts.message | opts.userId are null/missing.");
		const user = await this.client.users.fetch(opts.userId).catch(() => {return;});
		if (!user) return;
		const data = await this.client.db.getUserData(opts.userId);
		if (opts.channel) opts.channel.send(opts.message);
		if (data.get("cst")?.split(";").includes("dnd")) return;
		user.send(opts.message).catch(() => {return;});
	}
	/**
	 * Updates the client presence
	 * @param {Discord.PresenceData} presence Data for presence to be passed into `client#user#presence#set` method
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
 * **NOTE:** Was originally in config.js, had to move due to client config. Now that I think about it, there was a much, much simpler way to do this. TODO: REVERT THIS TO THE OLD WAY IN WHICH IT USED TO BE STORED, BUT INSTEAD THIS TIME JUST HAVE THE CONFIG OBJECT BEING DECLARED **BEFORE** THE FNCS CLASS. DO NOT FORGET, THANK U :)
 * Used to send an error to the exceptions channel and stderr
 * The function name is capitalised in order to prevent me from overusing it (yeah, I'm that lazy)
 * This function was not able to go in the `config.js` file due to certain complications
 * @param {string} e exception that is to be recorded
 * @param {?string} msgCont message content (only if this was used in a command - really helps with debugging)
 * @param {Discord.Client} client The currently instantiated Discord client
 */
	notify(e, msgCont, client) {
		if (client && typeof e === "string") process.logger.warn("DEPRECATION", "Client does not need to be passed into the client.utils.notify method.");
		if (typeof e !== "string") e = e.stack;
		const rn = new Date().toISOString();
		process.logger.error("CommandError", e.stack);
		if (!msgCont) {
			(this.client || client).channels.cache.get((this.client).const.channels.error).send({
				content: `[${rn}]: <unhandledRejection>:\n\`${e.replaceAll(process.cwd(), "[cwd]/")}\``,
			// very unliekly that a normal exception/error will exceed 2,000 characters in length.
			}).catch(() => {return;});
		// to prevent messageSendFailure erros from throwing. They flood the console and often I can't do anything about it so it's better to just ignore those.
		}
		else {
			this.client.channels.cache.get(this.client.const.channels.error).send({
				content: `[${rn}]: <unhandledRejection>:\n\`${e}\``,
				embeds: [
					new MessageEmbed()
						.setColor("#da0000")
						.setDescription(msgCont instanceof Promise ? "Promse { <rejected> }" : msgCont.toString() || "Message content unavailable."),
				],
			})
				.catch(() => {return;});
		}
	}
	/**
	 * Removes zeros from an array.
	 * @param {number[]} array Removes all zeros from the array.
	 * @returns {number[]}
	 */
	removeZeros(arr) {
		for (const elmt in arr) {
			if (arr[elmt] == 0 || arr[elmt].toString() == "0&0") arr[elmt] = "";
		}
		return arr;
	}
	/**
	 * Applies the Ross Capitalisation technique to the specified string
	 * @example "hi how are you" -> "Hi How Are You"
	 * @param {string} str String to be capitalised
	 * @returns {string}
	 */
	rossCaps(str) {
		return str.split(" ").map(this.capital).join(" ");
	}
	/**
	 * The is used for updating a user's balance.
	 * This method should be used instead of raw SQL queries as this method will
	 * log successful transactions.
	 * @param {Discord.UserResolvable} user A Discord user resolvable
	 * @param {number | bigint} amount Amount to be added to the user's balance. May be negative.
	 * @param {Discord.Message} message The message received by the `messageCreate` event
	 * @param {object} overrides Optional overrides
	 * @param {string} [overrides.a] Optional override for text next to "A<"
	 * @param {string} [overrides.r] Optional overrides for text next to "R<"
	 */
	async updateBalance(user, amount, message, overrides = {}) {
		amount = BigInt(amount);
		const data = await this.client.db.getUserData(user.id);
		// console.log("Set bal ID as ", bal, typeof bal);
		await this.client.db.USERS.update({
			bal: this.format(this.expand(data.get("bal") || "0") + amount),
		}, {
			where: {
				id: user.id,
			},
		});
		const logMsg = `${Math.floor(Date.now() / 60_000)} (${message.guild.name} (${message.guild.id})) A<${overrides.a ?? `${message.author.tag} (${message.author.id})`}> R<${overrides.r ?? `${user.tag} (${user.id})`}> ${amount < 0 ? "-" : "+"}${this.digits(amount, 10).replace(/[+-]/gi, "")}`;
		process.logger.updateLogsFile("tt", message, true, logMsg, logMsg);
	}
	/**
	 * Converts a number with either leading or trailing zeros to the shorthand notation.
	 * In the example, all leading zeros are removed. As the trailing zeros are important, they are
	 * represented by the number after the "&" symbol. Eg 1&10 means "1" with 10 zeros after it.
	 * @example 0044574000000 becomes "4457&6"
	 * @param {BigInteger | String} number Number to be converted to shorthand notation
	 * @returns {string}
	 */
	format(number) {
		number = BigInt(number);
		if (number === 0n) return "0";
		const arr = number.toString().split("");
		while (arr[0] === "0") {
			arr.shift();
		}

		let zeros = 0;
		let lastNonZero;
		for (const index in arr) {
			const element = arr[index];
			if (element !== "0") {
				lastNonZero = Number(index);
				continue;
			}
			// EQ 0
			// check to make sure no non-zero digits after this index
			if (Number(arr.slice(index, arr.length + 1).join("")) > 0) continue;
			zeros++;
		}
		if (zeros === 0) return arr.join("");
		return `${lastNonZero === 0 ? arr[0] : arr.slice(0, lastNonZero + 1).join("")}&${zeros}`;
	}
	/**
	 * Expands any formatted numbers and returns them as `BigInteger`s.
	 * @param {string} str The string to be expanded
	 * @returns {BigInteger}
	 */
	expand(str) {
		if (!str || str === "" || str === "0") return 0n;
		str = str.toString();
		if (!str.includes("&")) return BigInt(str);
		str = str.split("&");
		return BigInt(`${str[0]}${"0".repeat(Number(str[1]))}`);
	}
}

export { Funcs };