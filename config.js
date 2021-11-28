const { Client, User, Collection, MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");

/**
 * These are some default functions. They have been globalised in such manner by purpose, as these functions are **__constantly__** in use by the programme, thus I deemed it more effecient to have one globalised class to manage and export functions.
 */
class Funcs {
	/**
	 * * Constructor
	 * @param {Client} client Discord.Client
	 */
	constructor(client) {
		this.client = client;
	};
	/**
	 * Capitalises the first letter of the given string and returns the new string. Only the first letter is capitalised.
	 * @param {String} str string to be capitalised
	 * @returns {String} capitalised string
	 */
	capital(str) {
		return str[0].toUpperCase() + str.slice(1);
	};
	/**
	 * Shows element in inspcted format 
	 * @param {Any} element Element to be inspected 
	 * @param {Number} pen How deep to penetrate through element
	 * @returns {String}
	 */
	Inspect(element, pen) {
		return require("util").inspect(element, { depth: isNaN(pen) ? 100000000 : Number(penetrate) });
	};
	/**
	 * Extracts the ID of a mentioned user from its raw content 
	 * @param {String} mention String to extract mention ID from
	 */
	getId(mention) {
		if (!mention) return;
		return mention.match(/^<@!?(\d+)>$/)[1];	
	};
    /**
     * Fetches a Discord User
     * @param {String} str The mention - either ID or raw <@(!)id>
     * @returns {User} Discord.User
     */
	 async fetchUser(str) {
        if (!str) return;
        str = str.toString();
        let usr;
        try {
            usr = await this.client.users.fetch(this.getId(str))
        } catch (err) {
            usr = await this.client.users.fetch(str).catch((x) => {})
        };
        return usr;
    };
	/**
	 * Inserts comma to a string; acts as a thousands separator 
	 * @param {string} x String in which to insert commas.
	 */
	 comma(x) {
		if (!x) return "0";
		return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
	};
	/**
	 * Applies digit trimming to a `str` instance
	 * @param {Number|String} bal String to show digits; may be str instance but not NaN
	 * @returns {String}
	 */
	digits(bal = "0") {
		if (!bal || (bal == "0")) return "0";
		bal = String(bal).toLowerCase().replace("+", "").replace("-", "");
		if (bal.includes("e")) {
			if (isNaN(bal.split("e")[1])) {
				return this.comma(bal);
			};
			let digits = Number(bal.split("e")[1]);
				digits -= 15;
			if (digits <= 0) {
				return this.comma(bal);
			};
			return `${this.comma(bal.split("e")[0].replace(".", "") + "0".repeat(20 - bal.split("e")[0].replace(".", "").length))}... [${digits} digits]`;
		} else {
			return this.comma(bal);
		};
	};
	/**
	 * This function will add hyphens to a string every X characters; view [the article type thingy](https://repl.it/talk/share/Insert-Hyphens-in-JavaScript-String/50244) for additional information.
	 * @param {String} str The string to hyphenify
	 * @param {Number} interval The interval of which to add hyphens to the string 
	 * @param {Object} options Options to be applied.
	 * @param {Boolean} options.removeWhiteSpaces Whether or not to remove whitespaces in the string
	 * @param {Boolean} options.includeNewLine Whether or not to include & register the newline character (`\n`) as a part of the string.
	 * @returns {String} String<hyphenified> Hyphenified String
	 */
	hyphen(str, interval, options) {
		if (!options) {
			options = {
				removeWhiteSpaces: true, //Whether or not to reomve whitespaces from the string 
				includeNewLine: false //Whether or not to inc new line
			};
		};
		if (typeof options !== 'object') {
			throw new TypeError("options must be of type object");
		};
		if (!str) return null;
		if (!interval) {
			interval = 1;
		};
		interval = Number(interval);
		str = str.toString();
		if (options.removeWhiteSpaces) {
			//remove whitespaces: 
			str = str.replace(/ +/g, '');
		};
		let matches;
		if (options.includeNewLine) {
			matches = str.match(new RegExp('.{1,' + interval + '}', 'gs')); 
		} else {
			matches = str.match(new RegExp('.{1,' + interval + '}', 'g')); 
		};
		if (!matches) return null;
		return matches.join('-');
	};
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
		if (((now - future) / 100) >= 0) return false; 
		var d = Math.abs(now - future) / 1000;
		var r = {};
		var s = {
				years: 31536000,
				months: 2592000,
				weeks: 604800,
				days: 86400,
				hours: 3600,
				minutes: 60,
				seconds: 1
		};
		Object.keys(s).forEach(function(key){
				r[key] = Math.floor(d / s[key]);
				d -= r[key] * s[key];
		});
		r = Object.entries(r).filter((x) => x[1] > 0);
		if (r.length < 1) return false;
		if (r.length > 1 && (!ws)) r = r.filter((x) => x[0] != "seconds");
		if (r.length == 2) return `${r[0][1]} ${r[0][0]} and ${r[1][1]} ${r[1][0]}`;
		function ls(arr) {
			return arr.map((elmt) => arr.indexOf(elmt) == (arr.length - 1) ? `and ${elmt}` : elmt)
		};
		return r.length >= 2 ? ls(r.map((x) => `${x[1]} ${x[1] == 1 ? x[0].slice(0, -1) : x[0]}`)).join(", ") : r.map((g) => `${g[1]} ${g[1] == 1 ? g[0].slice(0, -1) : g[0]}`).join(', ');
	};
	/**
	 * Removes the exponent ("E") on numbers expressed in scientific notation
	 * @param {Number} x Number that is to be expanded.
	 * @returns Returns the number, expressed in its extended form
	 */
	noExponents(x) {
		var data = String(x).split(/[eE]/);
		if (data.length == 1) return data[0]; 

		let z = '';
		let sign = x < 0 ? '-' : '';
		let str = data[0].replace('.', '');
		let mag = Number(data[1]) + 1;
		if (mag < 0) {
			z = sign + '0.';
			while (mag++) z += '0';
			return z + str.replace(/^\-/,'');
		};
		mag -= str.length;  
		while (mag--) z += '0';
		return str + z;
	};
	/**
	 * Stuns a user whilst performing required validatory actions beforehand
	 * @param {String} id Snowflake ID of the user who must be stunned
	 * @param {Number} amt amount of minutes which the user must be stunned
	 */
	async stn(id, amt, client) {
		let user = await this.fetchUser(id)
			.catch((x) => {});
		if (!user) return false;
		let dns = await client.db.get("dns" + id);[]
			dns = isNaN(dns) ? 0 : Number(dns);
			dns = dns * client.config.exp;
		if (dns && (Date.now() < dns)) return;
		let ms = amt * 60 * 1000; 
		await client.db.set("stn" + id, Math.trunc((Date.now() + ms)/this.config.exp));
		return true;
	};
	/**
	 * Converts normal string text into binary text.
	 * @param {String} text Text to convert into binary.
	 * @returns {String} string of binary digits
	 */
	text2Binary(text) {
		return text.split("").map((char) => {
				return char.charCodeAt(0).toString(2);
		}).join(" ");
	};
	/**
	 * Converts a normal array to a 2d array of optional number of subvalues.
	 * @param {Array} list Original 1d array
	 * @param {Number} elementsPerSubArray No. of elements per subArray 
	 * @returns {Any[]} matrix matrix (the new array)
	 */
	listToMatrix(list, elementsPerSubArray) {
		let matrix = [], i, k;
		for (i = 0, k = -1; i < list.length; i++) {
			if (i % elementsPerSubArray === 0) {
				k++;
				matrix[k] = [];
			};
			matrix[k].push(list[i]);
		};
		return matrix;
	};
	/**
	 * 
	 * @param {Array<Any} arr Original list
	 * @param {Number} old_index index of old item
	 * @param {Number} new_index new index of item
	 * @returns {Array<Any>}
	 */
	arrayMove(arr, old_index, new_index) {
		if (new_index >= arr.length) {
				var k = new_index - arr.length + 1;
				while (k--) {
						arr.push(undefined);
				};
		};
		arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
		return arr;
	};
	/**
	 * @param {Array<Any>} arr array to be listed 
	 * @returns {String}
	 */
	list(arr) {
		return arr.map((x) => arr.length > 1 ? (arr.indexOf(x) == arr.length - 1 ? `and \`${x}\`` : `\`${x}\``) : `\`${x}\``).join(", ");
	};
	/**
	 * Returns a random number between the two endpoints, r.
	 * @param {Number} min minimum value of r 
	 * @param {Number} max maximum value of r
	 * @returns {Number} r
	 */
	getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	/**
	 * 
	 * @param {Date} now Current MS timestamp
	 * @param {Number} cd Cooldown to add (in MS)
	 * @param {Boolean} includeDecimals Whether or not to include decimals into the date returned
	 * @returns {Date} Date at which the cooldown will end --- in MS
	 */
	parseCd(now, cd, includeDecimals = false) {
		if (includeDecimals == true) {
			return parseFloat(((now + cd) / this.defaults.exp)).toFixed(2);
		} else {
			return Math.trunc(((now + cd) / this.defaults.exp));
		};
	};
	/**
	 * This function will allow you to trim a string such that it does not exceed the provided `max` length.
	 * @param {String} str The string which is to be trimmed.
	 * @param {Number} max The maximum amount of chars that the string passed into this function cannot exceed.
	 * @param {Boolean} dots If exceeded, then this param allows for you to control whether or not you'd like 3 dots to replace the last 3 chars of the string.
	 * @returns {String} str
	 */
	trim(str = "", max, dots = false) {
		if (str.length > max) {
			return `${str.slice(0, max - 3)}${dots ? "..." : ""}`;
		} else {
			return str;
		};
	};
	/**
	 * This function will cache all the commands in `dir`, therefore making them usable.
	 * @param {String} dir Directory of which to load commands from
	 * @param {Collection} clientCommands client.commands collection - loads commands into this collection
	 * @returns {Array|Error}
	 */
	cacheCommands(dir, clientCommands) {
		try {
			var cmds = 0;
			for (const file of readdirSync(dir).filter((f) => f.endsWith(".js"))) {
				const cmd = require(`${dir}/${file}`);
				clientCommands.set(cmd.name, cmd);
				cmds += 1;
			};
			return [true, cmds]; //true indicating success
		} catch (err) {
			throw new Error(`Error while attempting to cache commands: ${err.stack}`);
		};
	};
	/**
	 * This function will get the display name and the emojis for a user's dragon alias.
	 * * Each user can have their own dragon alias (of course, I would have to add it to `petaliases.json` for it to be registered as such).
	 * * An "alias" allows a user to replace the "dragon" for anything else, as well as allowing them to choose custom emojis for their stats on their dragon. In the latter parts of the bot, there is a system that will allow users to give/take access of the alias from people. 
	 * * Users are able to do `~dragonalias` to see a list of their aliases, indexed. They will then do `~dragonalias <index>`, replacing `<index>` with the index of their choice, which means that the bot will switch their alias to whatever they had chosen.
	 * @param {String} uid The ID of a Discord user whose dragon alias is to be fetched
	 * @returns {Array<string, string}
	 */
	async getDragonAlias(uid) {
		const currAlias = await client.db.get("curralias" + uid) || "default";
		if (currAlias) {
			const aliases = require('../petaliases.json');
			const names = Object.keys(aliases);
			if (names.includes(currAlias)) {
				return [aliases[currAlias].DISPLAY_NAME, aliases[currAlias].EMOJIS];
			} else {
				return ["dragon", ["<:heart:912982056802340877>", ":zap:", ":star2:", ":star:", ":bulb:", ":field_hockey:", ":fire:", ":sparkling_heart:", ":pizza:" ]];
			};
		};
	};
};

//static values  

const config = {
	ssInvite: "https://discord.gg/",
	supportServer: "911784758600679455",
	defaults: {
		intendedPetLength: 10,
		dragon: "1;10000;100;0;1;1;1;1;0;1",
		maxPet: '999999999;999999999;999999999;999999999;999999999;999999999;999999999;999999999;999999999;999999999',
		clr: "#00aaaa",
		maxLvl: 50,
		boostPay: 5000,
		exp: 60000,
		inf: "∞",
		cds: ["adrenc;dose adrenaline", 'cfc;coinflip', 'dialc;dial', 'dlc;daily', 'dpc;deprive', 'dgrc;downgrade', 'fdc;feed', 'fishc;fish', 'robc;rob', 'sntc;sentence', 'sgstc;suggest', 'srchc;search', 'strc;stroke', 'xpc;xp cooldown'],
		channels: {
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
			cmdLog: "912616134057025536"
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
			blacklistedRole: "912641487257337896",
			col: "912641555184123924", //add col to list
			supreme: "912641563291713566",
			warrior: "912641565346914304",
			human: "912641644547936267",
			memberRole: "912641644547936267",
			muted: "912641654391988224",
			civ: "912641353333211146",
			botDeveloper: "912641730522783795",
			srmod: "912641369141559297"
		},
		emoji: {
			tick: '<:tick:912982622731370576>',
			err: '<:error:912982623830282281>',
			fishing_rod: '<:fishrod:912982603425005588>',
			mobile_phone: ':iphone:',
			phonebook: ':book:',
			chill: "<:chillpill:912982008077107280>",
			loading: "<a:googleloading:912982110556545094>",
			target: "<:target:912982532461588600>",
			heart: "<:heart:912982056802340877>",
			adrenaline: "💉"
		},
		colors: {
			green: '#4bc46b',
			red: '#e61c1c',
			invisible: "#36393e"
		},
		webhooks: {
			debugger: "https://discord.com/api/webhooks/914286031325507584/rp7BIeS5RaZegZI3YzSfUlpyxASeA0dJfWC48O38fcaEe6EyH7LEAUxWY6mimmq0Ucyj"
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
			"12": [ "Bypassing Punishments via the means of alts", 3 ],
			"13": [ "Leaving server to evade punishments (before punished; not after)", 3 ],
			"14": [ "Excessively Rude", 1 ]
		},
		foods: {
			dolp: {
				name: "dolphin",
				key: "fsh;0",
				emoji: ":dolphin:",
				gives: {
					hp: 100,
					en: 10,
				}
			},
			sh: {
				name: "shark",
				key: "fsh;1",
				emoji: ":shark:",
				gives: {
					hp: 0,
					en: 50
				}
			},
			blow: {
				name: "blowfish",
				key: "fsh;2",
				emoji: ":blowfish:",
				gives: {
					hp: 0,
					en: 15
				}
			},
			trop: {
				name: "tropical_fish",
				key: "fsh;3",
				emoji: ":tropical_fish:",
				gives: {
					hp: 500,
					en: 35
				}
			},
			f: {
				name: "fish",
				key: "fsh;4",
				emoji: ":fish:",
				gives: {
					hp: 2500,
					en: 55
				}
			},
			ch: {
				name: "chillpill",
				key: "chillpills",
				emoji: "<:chillpill:722828409331253349>",
				gives: {
					hp: 0,
					en: 100
				}
			}
		}	
	},
	prefix: "~",
	upgr: ["int;intellect;5", "end;endurance;6", "str;strength;7", "gl;glycogenesis;9"],
	reqs: [400, 800, 1600, 3200, 6400, 12800, 25600, 51200, 102400, 204800, 409600, 819200, 1638400, 3276800, 6553600, 13107200, 26214400, 52428800, 104857600, 209715200, 419430400, 838860800, 1677721600, 3355443200, 6710886400, 13421772800, 26843545600, 53687091200, 107374182400, 214748364800, 429496729600, 858993459200, 1717986918400, 3435973836800, 6871947673600, 13743895347200, 27487790694400, 54975581388800, 109951162777600, 219902325555200, 439804651110400, 879609302220800, 1759218604441600, 3518437208883200, 7036874417766400, 14073748835532800, 28147497671065600, 56294995342131200, 112589990684262400, 225179981368524800], // - doubles each time, so it becomes harder for users to level up their dragon as their dragon becomes a higher level. These values were previously determined by an algorithm, however I deemed it faster in the ling run to just have them hard-coded. It saves processing time too, albeit not much, but it can help the bot catch up if there are loads of incompleted requests.
	PET_EMOJIS: [ "<:heart:912982056802340877>", ":zap:", ":star2:", ":star:", ":bulb:", ":field_hockey:", ":fire:", ":sparkling_heart:", ":pizza:" ]
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
	[ "updt", config.defaults.roles.updates ]
];

class ClientConfiguration extends Funcs {
	constructor(client) {
		super(client);
		this.client = client;
	};
	owner = "501710994293129216"; //<-- Discord User ID of the owner of the bot
	statics = config;
	doses = [
		[ `ch;chillpill;1;chillc;6h;${this.statics.defaults.emoji.chill}`, (async(message, MessageEmbed) => {
				let x = await message.client.db.get(`chillpills${message.author.id}`) || 0;
				if (Number(x) == 0) {
					return message.reply(`${message.client.config.emoji.chill} You don't have any chill pills!`)
				};
				await message.client.db.set(`chillpills${message.author.id}`, Number(x - 1));
				message.client.config.config.defaults.cds.forEach(async(c) => {
					c = c.split(";")[0];
					await message.client.db.delete(c + message.author.id);
				});
				message.reply({
					embed: new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has consumed a ${message.client.config.emoji.chill} and cleared all of their cooldowns!`)
				});
			}),
		], [
			"adren;adrenaline;45m;adrenc;3h;💉", (async(message, MessageEmbed) => {
				let adren = await message.client.db.get("adren" + message.author.id);
				if (!adren || (isNaN(adren))) adren = 0;
				if (adren - 1 < 0) return message.reply("You don't have any adrenaline left!");
				adren = adren - 1;
				await message.client.db.set("adren" + message.author.id, adren);
				message.reply({
					embed: new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has injected themselves with 💉!`)
				});
			})
		],
	];	
};

module.exports = ClientConfiguration;