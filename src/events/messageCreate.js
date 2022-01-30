import { existsSync, writeFile, createWriteStream } from "fs";
import { Collection, MessageEmbed, Util } from "discord.js";
import delay from "delay";
import ms from "ms";

export default {
	name: "messageCreate",
	once: false,
	isDM(channel) {
		return channel.type == "DM";
	},
	async execute(client, message, execOptions) {
		if (!message.author || message.webhookId) return;
		// If the message is a partial structure, fetch the full one form the API.
		// Note that you cannot fetch deleted information from the API - hence the catch statement (to prevent errors from occurring).
		if (message.partial) message = await message.fetch().catch(() => {return;});
		if (execOptions) {
			message.author = execOptions.author;
			message.content = execOptions.content;
			message.emit = true;
			message.channel.send(`Setting this.message.author.id as ${message.author.id}\nSetting this.message.content as ${message.content}. Marked this.message.emit as true`);
		}
		const data = await client.db.getUserData(message.author.id);
		let channel = await client.db.CHNL.findOne({ where: { id: message.channel.id } });
		if (!channel) channel = await client.db.CHNL.create({ id: message.channel.id });
		const cst = data.get("cst") ? data.get("cst").split(";") : [];
		if (message.guild) {
			let guild = await client.db.GUILDS.findOne({ where: { id: message.guild.id } });
			if (!guild) guild = await client.db.GUILDS.create({ id: message.guild.id });
			if (!message.guild || (message.author.bot && (!cst.includes("wl"))) || (message.system) || (message.webhookId)) return;
			message.guild.prefix = guild.get("prefix") || client.const.prefix;
			if (message.guild?.id == client.const.supportServer) {
				if (/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/g.test(message.content.toLowerCase()) && (!cst.includes("linkp"))) {
					message.delete({ reason: "Author posted an invite" });
					return client.commands.get("mute")
						.run(client, { guild: message.guild, channel: message.channel, member: message.guild.member(client.user), author: client.user }, [ message.author.id, "0", "posting server invites" ])
						.catch(console.error);
				}
				if (message.channel.parentId != client.const.channels.spamCat) {
					let rateLimit = client.collection.get(message.author.id) || 0;
					rateLimit = Number(rateLimit);
					client.collection.set(message.author.id, rateLimit + 1);
					if (rateLimit >= 5 && (!cst.includes("tmod"))) {
						const limit = "5/2s";
						await message.member.roles.add(client.const.roles.muted);
						await client.db.USERS.update({
							mt: `${(message.createdTimestamp + ms("10m")) - client.utils.epoch};hitting the message send rate limit (${limit})`,
						}, {
							where: {
								id: message.author.id,
							},
						});
						const msg = `You have received a 10 minute mute from ${message.guild.name} because of hitting the message send rate limit (${limit}); please DM ${client.users.cache.get(client.const.display).tag} if you beleive that this is a mistake. If you aren't unmuted after 10 minutes, then please contact a moderator and ask them to unmute you.`;
						// yeah this aint gonna work
						// todo: fix this !!!!!!!!
						client.commands.get("mute").run(client, message, [message.author.id, 10, msg]);
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
					xp[1] += client.utils.getRandomInt(14, 35);
					if ((xp[1] / 200) > xp[0]) {
						message.channel.send({ content: `Congratulations, you've levelled up! You're now level **${xp[0] + 1}**! View your XP and level by typing \`${message.guild ? message.guild.prefix : client.const.prefix}level\``, allowedMentions: { repliedUser: false } });
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
					client.commands.get("mute").run(client, message, [ message.author.id, "0", "[automatic-mute]: Mass Mention" ]);
				}
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
		const rand = Math.floor(Math.random() * 10);
		if (rand >= 9.5 && !this.isDM(message.channel)) {
			await client.db.CHNL.update({
				pkg: true,
			}, {
				where: {
					id: message.channel.id,
				},
			});
			message.channel.send({
				content: `Someone just dropped their :briefcase: briefcase in this channel! Hurry up and pick it up with \`${message.guild ? message.guild.prefix : client.const.prefix}steal\``,
			});
		}

		if (!message.content.startsWith(message.guild?.prefix || "~")) return;
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

		const args = message.content.slice(this.isDM(message.channel) ? client.const.prefix.length : message.guild.prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();
		const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
		const stnb = data.get("stnb") || "stunned";
		if (cst.includes("pstn") && (!cst.includes("antistun"))) {
			return message.reply({ content: `You can't do anything while you're ${stnb}! (${Math.round(message.createdTimestamp / 60_000)} minutes left)` });
		}

		// todo: make a <Command>.usableWS? : <Boolean> - stands for command.useableWhileStunned?<Boolean>
		if (!["punish", "unpunish", "offences", "ban", "mute", "unmute", "warn"].includes(command?.name)) {
			let stun = data.get("stn") || 0;
			if (stun && (!cst.includes("antistun"))) {
				stun = Number(stun) * 60_000;
				if (stun - message.createdTimestamp >= 1000) {
					return message.reply({ content: `You can't do anything while you're ${stnb}! (${client.utils.cooldown(message.createdTimestamp, stun)} left)` });
				}
			}
		}

		if (!command) return;

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

		message.author.color = data.get("clr") || client.const.clr;
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

		if ((command.guildOnly || command.ssOnly) && this.isDM(message.channel)) {
			return message.reply({ content: "This command may not be executed in a DMChannel. Try running the command in a server.", allowedMentions: { repliedUser: true } });
		}

		if (command.disabled) {
			return message.reply({
				content: "🤧 This command has been disabled by an administrator. Sorreh.",
			});
		}

		if (command.cst && (!cst.includes(command.cst) && ((!client.const.owners.includes(message.author.id))))) {
			return message.reply(command.cstMessage || "You're not allowed to use this command!");
		}

		if (command.ssOnly && (message.guild.id != client.const.supportServer)) {
			return message.reply(`Sorry but this command can only be used in my support guild! Join by using the \`${message.guild ? message.guild.prefix : client.const.prefix}links\` command!`);
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
		const LOG = Util.splitMessage(`[${old + 1} ${client.uptime}] ${Math.trunc(message.createdTimestamp / 60000)}: ${!this.isDM(message.channel) ? `[${message.guild.name} (${message.guild.id})][${message.channel.name}]` : `[DMChannel (${message.channel.id})]`}<${message.author.tag} (${message.author.id})>: ${message.content}\n`, { maxLength: 2_000, char: "" });
		try {
			// this just attaches data onto message.author, meaning that I can use it anywhere where I have message.author. Beautiful!
			// and refresh data while you're at it, thank youp
			message.author.data = await data.reload();
			await command.run(client, message, args);
		}
		catch (e) {
			client.channels.cache.get(client.const.channels.error).send({
				content: `[${new Date().toISOString()}]: Exception< (type: caughtError, onCommand?: true;) >:\n\`${e}\``,
				embeds: [
					new MessageEmbed()
						.setColor(client.const.colors.invisible)
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
			client.channels.cache.get(client.const.channels.error).send({
				content: `${message.createdTimestamp / 60_000}: error while updating db values "${message.author.id}.cmds"`,
			});
		}

		let send = true;
		if (client.const.owners.includes(message.author.id) && !cst.includes("adminlg")) send = false;
		if (command && (!message.emit)) {
			// prevents commands executed by another using from being logged. Helps cut down on spam and unnecessary logging.
			if (command.logAsAdminCommand || command.cst == "administrator132465798") {
				const today = new Date(message.createdTimestamp).toISOString().split("T")[0].split("-").reverse().join("-");
				// today example: 13-12-2021 (for: 13 Dec 2021)
				const fLog = Util.splitMessage(`[${client.uptime}]: ${Math.trunc(message.createdTimestamp / 60000)}: ${this.isDM(message.channel) ? `[DMChannel (${message.channel.id})]` : ""} ${!this.isDM(message.channel) ? `[${message.guild.name} (${message.guild.id})][${message.channel.name} (${message.channelId})]` : ""}<${message.author.tag} (${message.author.id})>: ${message.content}\n`, { maxLength: 2_000, char: "" });
				if (!existsSync(`./.adminlogs/${today}.txt`) && send) {
					const b = Date.now();
					client.channels.cache.get(client.const.channels.adminlog).send({ content: `Logs file \`./.adminlogs/${today}\` not found\nAttempting to create new logs file...` });
					writeFile(`./.adminlogs/${today}.txt`, fLog.join(""), ((err) => {
						if (err) console.error(err) && client.channels.cache.get(client.const.channels.adminlog).send({ content: `Error whilst creating new logs file: \`${err}\`` });
						client.channels.cache.get(client.const.channels.adminlog).send({ content: `Successfully created new logs file in ${Date.now() - b} ms` });
					}));
				}
				else {
					createWriteStream(`./.adminlogs/${today}.txt`, { flags: "a" }).end(fLog.join(""));
				}
				if (send) {
					await delay(100);
					// delaying ensures that the log message is sent AFTER writing to the txt file.
					Util.splitMessage(`${client.uptime} ${Math.trunc(message.createdTimestamp / 60_000)}: ${!this.isDM(message.channel) ? `[${message.guild.name}]` : `[DMChannel (${message.channel.id})]`}<${message.author.tag} (${message.author.id})>: ${message.content}\n`, { maxLength: 2_000, char: "" }).forEach(async (cntnt) => {
						await client.channels.cache.get(client.const.channels.adminlog).send({ content: cntnt, allowedMentions: { parse: [] } });
					});
				}
			}
			// this optimised the below if statement by making it less cluttery and by handling half of it.
			if (command.logs || (["tmod", "moderator", "srmod"].includes(command.cst)) && send) {
				if (!command.logs) command.logs = [];
				if (["tmod", "moderator", "srmod"].includes(command.cst)) command.logs.push(client.const.channels.modlog);
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