import { existsSync, writeFile, createWriteStream } from "fs";
import { Collection, MessageEmbed, Util } from "discord.js";
import delay from "delay";
import ms from "ms";

export default {
	name: "messageCreate",
	once: false,
	async execute(client, message, execOptions) {
		if (!message.author || message.webhookId) return;
		if (execOptions) {
			message.author = execOptions.author;
			message.content = execOptions.content;
			message.emit = true;
			message.channel.send(`Setting this.message.author.id as ${message.author.id}\nSetting this.message.content as ${message.content}. Marked this.message.emit as true`);
		}
		const data = await client.db.getUserData(message.author.id);
		let channel = await client.db.CHNL.findOne({ where: { id: message.channel.id } });
		if (!channel) channel = await client.db.CHNL.create({ id: message.channel.id });
		let guild = await client.db.GUILDS.findOne({ where: { id: message.guild.id } });
		if (!guild) guild = await client.db.GUILDS.create({ id: message.guild.id });
		const cst = data.get("cst") ? data.get("cst").split(";") : [];
		if (!message.guild || (message.author.bot && (!cst.includes("wl"))) || (message.system) || (message.webhookId)) return;
		if (message.partial) message = await message.fetch();
		message.guild.prefix = guild.get("prefix");
		if (message.guild.id == client.config.statics.supportServer) {
			if (/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/g.test(message.content.toLowerCase()) && (!cst.includes("linkp"))) {
				message.delete({ reason: "Author posted an invite" });
				return client.config.commands.get("mute")
					.run(client, { guild: message.guild, channel: message.channel, member: message.guild.member(client.user), author: client.user }, [ message.author.id, "0", "posting server invites" ])
					.catch(console.error);
			}
			if (message.channel.parentId != client.config.statics.defaults.channels.spamCat) {
				let rateLimit = client.collection.get(message.author.id) || 0;
				rateLimit = Number(rateLimit);
				client.collection.set(message.author.id, rateLimit + 1);
				if (rateLimit >= 5 && (!cst.includes("tmod"))) {
					const limit = "5/2s";
					await message.member.roles.add(client.config.statics.defaults.roles.muted);
					await client.db.USERS.update({
						mt: `${(message.createdTimestamp + ms("10m")) - client.config.epoch};hitting the message send rate limit (${limit})`,
					}, {
						where: {
							id: message.author.id,
						},
					});
					const msg = `You have received a 10 minute mute from ${message.guild.name} because of hitting the message send rate limit (${limit}); please DM ${client.users.cache.get(client.config.owner).tag} if you beleive that this is a mistake. If you aren't unmuted after 10 minutes, then please contact a moderator and ask them to unmute you.`;
					// yeah this aint gonna work
					// todo: fix this !!!!!!!!
					client.config.commands.get("mute").run(client, message, [ message.author.id, 10, msg ]);
				}
				setInterval(() => client.collection.delete(message.author.id), 2_000);
			}
			const coold = data.get("xpc");
			// eslint-disable-next-line no-empty
			if ((message.createdTimestamp / 60_000) < coold) {

			}
			else if (!cst.includes("noxp")) {
				// no cooldown; add xp.
				const xp = data.get("xp").split(";").map(Number);
				xp[1] += client.config.getRandomInt(14, 35);
				if ((xp[1] / 200) > xp[0]) {
					message.channel.send({ content: `Congratulations, you've levelled up! You're now level **${xp[0] + 1}**! View your XP and level by typing \`${message.guild.prefix}level\``, allowedMentions: { repliedUser: false } });
					xp[0]++;
				}
				await client.db.USERS.update({
					xp: xp.join(";"),
					xpc: Math.trunc(message.createdTimestamp / 60_000) + 1,
				}, {
					where: {
						id: message.author.id,
					},
				});
			}
			if (message.mentions.members.size + message.mentions.users.size + message.mentions.roles.size > 5) {
				client.config.commands.get("mute").run(client, message, [ message.author.id, "0", "[automatic-mute]: Mass Mention" ]);
			}
		}

		const bal = data.get("bal");
		const chp = data.get("chillpills");
		const fish = data.get("fsh") ? data.get("fsh").split(";") : [0, 0, 0, 0, 0, 0, 0];
		message.content = message.content
			.replace(/myid/g, message.author.id)
			.replace(/allmoney/g, bal)
			.replace(/alldolphin/g, fish[0])
			.replace(/allshark/g, fish[1])
			.replace(/allblowfish/g, fish[2])
			.replace(/alltropical/g, fish[3])
			.replace(/allfish/g, fish[4])
			.replace(/allchp/g, chp);
		/*	const replacers = data.get("replacers");
		if (replacers && (typeof replacers === "object")) {
			for (const x in replacers) {
				if (!replacers[x].content) continue;
				message.content = message.content.replace(new RegExp(`{${x}}`, "gm"), replacers[x].content);
			}
		} */
		const rand = Math.floor(Math.random(1) * 10);
		if (rand < 2) {
			if (rand > 7) {
				await client.db.CHNL.update({
					pkg: true,
				}, {
					where: {
						id: message.channel.id,
					},
				});
				message.channel.send({
					content: `Someone just dropped their :briefcase: briefcase in this channel! Hurry up and pick it up with \`${message.guild.prefix}steal\``,
				});
			}
		}

		if (!message.content.startsWith(message.guild.prefix)) return;
		if (cst.includes("debugger")) {
			message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setTitle("Message content parsed as:")
						.setDescription("```\n" + message.content + "\n```"),
				],
			});
		}
		const args = message.content.slice(message.guild.prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();
		const command = client.config.commands.get(commandName) || client.config.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
		const stnb = data.get("stnb") || "stunned";
		if (cst.includes("pstn") && (!cst.includes("antistun"))) {
			return message.reply({ content: `You can't do anything while you're ${stnb}! (${Math.round(message.createdTimestamp / 60_000)} minutes left)` });
		}
		if (!command || (command)) {
			const k = command ? command.name : commandName || "";
			// todo: make a <Command>.usableWS? : <Boolean> - stands for command.useableWhileStunned?<Boolean>
			if (!["punish", "unpunish", "offences", "ban", "mute", "unmute", "warn"].includes(k)) {
				let stun = data.get("stn");
				if (stun && (!cst.includes("antistun"))) {
					stun = Number(stun) * 60_000;
					if (stun - message.createdTimestamp >= 1000) {
						return message.reply({ content: `You can't do anything while you're ${stnb}! (${client.config.cooldown(message.createdTimestamp, stun)} left)` });
					}
				}
			}
		}

		for (const arg in args) {
			const value = args[arg];
			if (!isNaN(value.replace("&", ""))) {
				const digits = "0".repeat(Number(value.split("&")[1]));
				args[arg] = `${value.split("&")[0]}${digits}`;
			}
			else if (value.split("|")) {
				if (!isNaN(args[arg].split("|")[1])) {
					args[arg] = args[arg].split("|")[0].repeat(Number(args[arg].split("|")[1]));
				}
			}
		}

		if (command) {
			message.author.color = data.get("clr");
			message.author.colors = message.author.color.split(";");
			const m = message.author.color.split(";");
			if (isNaN(m[m.length - 1])) m[m.length - 1] = "0";
			if (Number(m[m.length - 1]) + 1 >= (m.length - 1)) {
				m[m.length - 1] = "0";
			}
			else {
				m[m.length - 1] = Number(m[m.length - 1]) + 1;
			}
			await client.db.USERS.update({
				clr: m.join(";"),
			}, {
				where: {
					id: message.author.id,
				},
			});
			message.author.color = message.author.color.split(";")[Number(m[m.length - 1])];
		}
		if (!command) return;
		const bcmd = data.get("bcmd") ? data.get("bcmd").split(";") : [];
		if (bcmd.includes(command.name) && (!cst.includes("administrator132465798"))) {
			// this allows for blacklisting of specific commands. Practically speaking, it is very useful as it allows me (or any other admin) to prevent users who are spamming a command from doing so.
			return message.reply("You do not have permissions to use that command!");
		}

		if (!client.collection.has(command.name)) {
			client.collection.set(command.name, new Collection());
		}

		// 5s command cooldown for each user, can be bypassed if they have a specific permission.
		// this exists to prevent spam/misuse
		const timestamps = client.collection.get(command.name);
		if (timestamps.has(message.author.id) && (!cst.includes("rebel"))) {
			const expirationTime = timestamps.get(message.author.id) + 5000;
			if (message.createdTimestamp < expirationTime) {
				const timeLeft = (expirationTime - message.createdTimestamp) / 1000;
				if (timeLeft > 0.0) {
					return message.reply(`You must wait another ${timeLeft.toFixed(1)} seconds before using another command!`);
				}
			}
		}
		timestamps.set(message.author.id, message.createdTimestamp);
		setTimeout(() => timestamps.delete(message.author.id), 5000);

		if (command.disabled) {
			return message.reply({
				content: "🤧 This command has been disabled by an administrator. Sorreh.",
			});
		}

		if (command.cst && (!cst.includes(command.cst) && ((message.author.id != client.config.owner)))) {
			return message.reply(command.cstMessage || "You're not allowed to use this command!");
		}

		if (command.ssOnly && (message.guild.id != client.config.statics.supportServer)) {
			return message.reply({ content: "This command only works in our support server! Join by using `" + message.guild.prefix + "support`!" });
		}

		function err(e) {
			console.error(e);
			if (!message.author.debug) {
				return message.reply(`Sorry, but an error occurred :/\n\`${e}\``);
			}
			else {
				message.reply({ embeds: [
					new MessageEmbed()
						.setColor("#da0000")
						.setTitle("[DEBUGGER]: Sorry, but an error occured :/")
						.setDescription(`\`\`\`\n${e.stack}\n\`\`\``),
				],
				});
			}
		}

		const clientData = await client.db.getUserData(client.user.id);
		const old = clientData.get("cmds");
		await client.db.USERS.update({
			cmds: old + 1,
		}, {
			where: {
				id: client.user.id,
			},
		});
		// do NOT remove the \n at the end of the log message. Doing so makes all the logs in the logs file being clumped together on the same line.
		const LOG = Util.splitMessage(`[${old + 1}] ${Math.trunc(message.createdTimestamp / 60000)}: [${message.guild.name} (${message.guild.id})][${message.channel.name}]<${message.author.tag} (${message.author.id})>: ${message.content}\n`, { maxLength: 2_000, char: "" });
		try {
			// this just attaches data onto message.author, meaning that I can use it anywhere where I have message.author. Beautiful!
			// and refresh data while you're at it, thank youp
			message.author.data = await data.reload();
			await command.run(client, message, args);
		}
		catch (e) {
			client.channels.cache.get(client.config.statics.defaults.channels.error).send({
				content: `[${new Date().toISOString()}]: Exception< (type: caughtError, onCommand?: true;) >:\n\`${e}\``,
				embeds: [
					new MessageEmbed()
						.setColor(client.config.statics.defaults.colors.invisible)
						.setDescription(LOG.join("")),
					// embed description has a max of 4k chars, very very unlikely that a normal message sent by a user will ever exceed that
				],
			});
			err(e);
		}
		try {
			const Old = data.get("cmds");
			await client.db.USERS.update({
				cmds: Old + 1,
			}, {
				where: {
					id: message.author.id,
				},
			});
		}
		catch (err) {
			client.channels.cache.get(client.config.statics.defaults.channels.error).send({
				content: `${message.createdTimestamp / 60_000}: error while updating db values "${message.author.id}.cmds"`,
			});
		}
		if (command && (!message.emit)) {
			// prevents commands executed by another using from being logged. Helps cut down on spam and unnecessary logging.
			if (command.logAsAdminCommand || command.cst == "administrator132465798") {
				const today = new Date(message.createdTimestamp).toISOString().split("T")[0].split("-").reverse().join("-");
				// today example: 13-12-2021 (for: 13 Dec 2021)
				const fLog = Util.splitMessage(`[${client.uptime}]: ${Math.trunc(message.createdTimestamp / 60000)}: [${message.guild.name} (${message.guild.id})][${message.channel.name} (${message.channelId})]<${message.author.tag} (${message.author.id})>: ${message.content}\n`, { maxLength: 2_000, char: "" });
				if (!existsSync(`./.adminlogs/${today}.txt`)) {
					const b = Date.now();
					client.channels.cache.get(client.config.statics.defaults.channels.adminlog).send({ content: `Logs file \`./.adminlogs/${today}\` not found\nAttempting to create new logs file...` });
					writeFile(`./.adminlogs/${today}.txt`, fLog.join(""), ((err) => {
						if (err) console.error(err) && client.channels.cache.get(client.config.statics.defaults.channels.adminlog).send({ content: `Error whilst creating new logs file: \`${err}\`` });
						client.channels.cache.get(client.config.statics.defaults.channels.adminlog).send({ content: `Successfully created new logs file in ${Date.now() - b} ms` });
					}));
				}
				else {
					createWriteStream(`./.adminlogs/${today}.txt`, { flags: "a" }).end(fLog.join(""));
				}
				await delay(100);
				// delaying ensures that the log message is sent AFTER writing to the txt file.
				Util.splitMessage(`${client.uptime}: [${message.guild.name}]<${message.author.tag} (${message.author.id})>: ${message.content}\n`, { maxLength: 2_000, char: "" }).forEach(async (cntnt) => {
					await client.channels.cache.get(client.config.statics.defaults.channels.adminlog).send({ content: cntnt, allowedMentions: { parse: [] } });
				});
			}
			// this optimised the below if statement by making it less cluttery and by handling half of it.
			if (command.logs || (["tmod", "moderator", "srmod"].includes(command.cst))) {
				if (!command.logs) command.logs = [];
				if (["tmod", "moderator", "srmod"].includes(command.cst)) command.logs.push(client.config.statics.defaults.channels.modlog);
				command.logs = [...new Set(command.logs)];
				const pst = [];
				for (const id of command.logs) {
					if (pst.includes(id)) continue;
					pst.push(id);
					LOG.forEach(async (cntnt) => {
						await client.channels.cache.get(id).send({ content: cntnt, allowedMentions: { parse: [] } });
					});
					await delay(3000);
				}
			}
		}
	},
};