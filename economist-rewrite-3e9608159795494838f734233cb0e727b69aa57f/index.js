﻿// "use strict";
/* eslint-env node es6 */
// package imports
const delay = require("delay");
const Discord = require("discord.js");
require("dotenv").config();
const fs = require("fs"); // eslint-disable-line no-unused-vars
const keyv = require("keyv"); require("@keyv/sqlite");
const ms = require("ms");

/** Client config values (defaults, functions, IDs, etc) */
const ClientConfiguration = require("./config.js");

/** Used for storing user command cooldowns and rate limits - there used to be 2 separate collections to store each, but that used more memory*/
const collection = new Discord.Collection();

/** The currently instantiated Discord.Client*/
const client = new Discord.Client({
	// Overriding the cache used in GuildManager, ChannelManager, GuildChannelManager, RoleManager, and PermissionOverwriteManager is unsupported and will break functionality
	makeCache: Discord.Options.cacheWithLimits({
		MessageManager: 100,
		GuildMemberManager: 100,
		PresenceManager: 0,
		GuildStickerManager: 0,
		GuildInviteManager: 0,
		GuildBanManager: 0,
	}),
	allowedMentions: { parse: ["users", "roles"], repliedUser: false },
	intents: new Discord.Intents().add([Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MEMBERS]),
/*	presence: {
		// (property) PresenceData.activities?: Discord.ActivitiesOptions[]
		activities: [
			{
				name: "you!",
				type: "LISTENING",
			},
		],
		status: "dnd",
		afk: true,
	},*/
});

client.db = new keyv("sqlite://./db.sqlite");
client.config = new ClientConfiguration(client);
// todo: shorten deldatareqed to just ddrq or something (actually, make it a CST).
client.keys = ["spse", "drgs", "bgc", "dialcount", "gcode", "upgr", "dose0", "dose1", "petname", "adren", "adrenc", "chillc", "mt", "cstmk", "stnb", "stn", "dns", "wl", "cgrl", "cfc", "bcmd", "nick", "chnl", "clr", "dlc", "fsh", "v", "sgstc", "crdt", "fdc", "hgs", "ofncs", "assigns", "curralias", "petbu", "cst", "cmds", "pet", "bal", "number", "chillpills", "sntc", "dialc", "strc", "spouse", "fishc", "deldatareqed", "bio", "replacers", "dpc", "robc", "srchc", "dgrc", "xpc"];

// This is used to cache all of the commands upon startup
client.config.commands = new Discord.Collection();

client.config.cacheCommands("./cmds", client.config.commands);

// `messageUpdate` event, emitted when a message is edited.
client.on("messageUpdate", async (oldMessage, newMessage) => {
	if (oldMessage.channel.type == "dm") return;
	if ((oldMessage.guild.id != client.config.statics.supportServer || (oldMessage.author.bot) || (oldMessage.content === newMessage.content))) return;
	client.channels.cache.get(client.config.statics.defaults.channels.msgLogs).send({ embeds: [
		new Discord.MessageEmbed()
			.setTitle("Message Edited in #" + oldMessage.channel.name)
			.setThumbnail(oldMessage.author.displayAvatarURL())
			.setColor("RANDOM")
			.addField("Old Message", client.config.trim(oldMessage.content, 1024), true)
			.addField("New Message", client.config.trim(newMessage.content, 1024), true)
			.setFooter("Edited", newMessage.author.avatarURL())
			.setTimestamp(),
	] });
});

client.on("messageDelete", async (message) => {
	if (message.guild.id !== client.config.statics.supportServer) return;
	if (message.content && (!message.author.bot)) {
		await client.db.set("snipe" + message.channel.id, {
			author: message.author.id,
			message: message.content || "n/a",
			at: Date.now(),
		});
	}
	const logs = client.channels.cache.get(client.config.statics.defaults.channels.msgLogs);
	const embed = new Discord.MessageEmbed()
		.setColor(client.config.statics.defaults.colors.red)
		.setTitle("Message Deleted in #" + message.channel.name)
		.addField("Message Sent At", require("moment")(message.createdTimestamp))
		.setFooter("Deleted: ")
		.setTimestamp()
		.setAuthor(message.author.tag, message.author.displayAvatarURL(), message.author.displayAvatarURL());
	if (!message.content && (message.attachments.size)) {
		embed
			.setDescription(`Attachments Detected: ${message.attachments.map(x => `[Attachment](${x.url})`).join(" ")}`)
			.setImage(message.attachments.first().url.replace("cdn", "media").replace("com", "net"));
	}
	else {
		embed
			.setDescription(message["content"]);
	}
	logs.send({ embeds: [embed] });
});

client.on("channelCreate", async (channel) => {
	if (["DM", "GROUP_DM"].includes(channel.type) || (channel.guild.id != client.config.statics.supportServer)) return;
	const audit = (await channel.guild.fetchAuditLogs({ limit: 1, type: "CHANNEL_CREATE" })).entries.first();
	channel = await channel.fetch();
	const channelPermissions = [...channel.permissionOverwrites.cache.values()].filter((d) => d.type == "member");
	channelPermissions.forEach(async (x) => {
		if (x.type != "member") return;
		const usr = await client.config.fetchUser(x.id);
		const mmbr = await client.guilds.cache.get(channel.guildId).members.fetch({ user: usr.id, force: true });
		let chn = await client.db.get("chnl" + x.id);
		chn = chn ? client.config.listToMatrix(chn.split(";"), 3) : [];
		// a new channel is being created, therefore we don't need to check to see if a previous entry exists (it's not easy to guess the snowflake accurately and correctly)
		chn.push([channel.id, x.deny.bitfield, x.allow.bitfield]);
		client.channels.cache.get(client.config.statics.defaults.channels.sflp).send({
			content: `
Audit log entry executed at ${new Date(audit.createdAt).toISOString()} by M:${audit.executor.tag}(${audit.executor.id})
Can manage?: ${mmbr.permissionsIn(channel).has(Discord.Permissions.FLAGS.MANAGE_CHANNELS)} (member: ${usr.id}, channel: ${channel.id}, allow: ${x.allow.bitfield}, deny: ${x.deny.bitfield})
${mmbr.permissionsIn(channel.id).has(Discord.Permissions.FLAGS.MANAGE_CHANNELS) ? `Adding ${usr.id} as a manager of channel ${channel.id}` : ""}
			`,
		});
		chn = chn.map((a) => Array.from(a).join(";"));
		chn = [...new Set(chn)];
		await client.db.set("chnl" + x.id, chn.join(";"));
		client.channels.cache.get(client.config.statics.defaults.channels.sflp).send({ content: `${Math.trunc(Date.now() / 60000)} U:<${usr.tag} (${usr.id})>: Successfully set chnl as ${client.config.trim(chn.join(";"), 1900)} ` });
	});
});

client.on("channelUpdate", async (oldChannel, newChannel) => {
	if (["DM", "GROUP_DM"].includes(oldChannel.type) || (oldChannel.guild.id != client.config.statics.supportServer)) return;
	// fetch full structure from Discord API
	// Only the partial structure is sent through the event.
	oldChannel = await oldChannel.fetch(true);
	newChannel = await newChannel.fetch(true);
	const audit = (await oldChannel.guild.fetchAuditLogs({ limit: 1, type: "CHANNEL_UPDAYE" })).entries.first();
	const oldPerms = [...oldChannel.permissionOverwrites.cache.values()].filter((d) => d.type == "member");
	const newPerms = [...newChannel.permissionOverwrites.cache.values()].filter((d) => d.type == "member");
	const rmv = [];
	for (const x in oldPerms) {
		if (!newPerms.map(({ id }) => id).includes(oldPerms[x].id)) {
			rmv.push(oldPerms[x].id);
		}
		else {continue;}
	}
	newPerms.forEach(async (x) => {
		const usr = await client.config.fetchUser(x.id);
		const mmbr = await client.guilds.cache.get(newChannel.guildId).members.fetch({ user: usr.id, force: true });
		let chn = await client.db.get("chnl" + x.id);
		chn = chn ? client.config.listToMatrix(chn.split(";"), 4) : [ [ newChannel.id, "", "", "" ] ];

		let indx = chn.findIndex((data) => data[0] == newChannel.id);
		console.log(chn[indx]);
		const prevChn = chn[indx] ? [...chn[indx]] : [newChannel.id, "", "", ""];
		console.log("prevChn\n" + prevChn);
		// ignore when stored data matches newChannel.
		let ignore = false;
		// whether or not the user previously managed the channel.
		function match() {
			return chn[indx][0] == newChannel.id && (chn[indx[1]] == x.deny.bitfield && (chn[indx][2] == x.allow.bitfield) && (chn[indx][3] == mmbr.permissionsIn(newChannel).has(Discord.Permissions.FLAGS.MANAGE_CHANNELS) ? "mngr" : ""));
		}
		if (indx >= 0) {
			if (match()) {
				client.channels.cache.get(client.config.statics.defaults.channels.sflp).send({ content: `Audit log entry at ${new Date(audit.createdAt).toISOString()} by ${audit.executor.tag}(${audit.executor.id}) in regard to ${usr.tag}(${usr.id}) was ignnored due to data already matching.` });
				ignore = true;
			}
			// not a complete match; update values.
			chn[indx][1] = x.deny.bitfield;
			chn[indx][2] = x.allow.bitfield;
			if (mmbr.permissionsIn(newChannel).has(Discord.Permissions.FLAGS.MANAGE_CHANNELS)) chn[indx][3] = "mngr";
		}
		else {
			chn.push([newChannel.id, x.deny.bitfield, x.allow.bitfield, mmbr.permissionsIn(newChannel).has(Discord.Permissions.FLAGS.MANAGE_CHANNELS) ? "mngr" : ""]);
			indx = chn.length - 1;
		}
		if (ignore == false) {
			console.log(prevChn);
			client.channels.cache.get(client.config.statics.defaults.channels.sflp).send({
				content: `
Audit log entry executed at ${new Date(audit.createdAt).toISOString()} by M:${audit.executor.tag}(${audit.executor.id})
Can manage?: ${mmbr.permissionsIn(newChannel).has(Discord.Permissions.FLAGS.MANAGE_CHANNELS)} (member: ${usr.id}, channel: ${newChannel.id}, allow: ${x.allow.bitfield}, deny: ${x.deny.bitfield})
${mmbr.permissionsIn(newChannel).has(Discord.Permissions.FLAGS.MANAGE_CHANNELS) && (prevChn[3] != "mngr") ? `Adding ${usr.id} as a manager of channel ${newChannel.id}` : ""}
				`,
			});
			chn = chn.map((a) => Array.from(a).join(";"));
			chn = [...new Set(chn)];
			await client.db.set("chnl" + x.id, chn.join(";"));
			client.channels.cache.get(client.config.statics.defaults.channels.sflp).send({ content: `${new Date().toISOString()}: U:<${usr.tag} (${usr.id})>: Successfully set U.chnl as ${client.config.trim(chn.join(";"), 1900)} ` });
		}

		// check to see if the user still has TextChannel.MANAGE_CHANNEL permissions
		// if not, remove them as a manager.
		console.log(chn, typeof chn);
		chn = chn.map((f) => f instanceof Array ? f : f.split(";"));
		if (chn[indx][3] == "mngr" && (!mmbr.permissionsIn(newChannel).has(Discord.Permissions.FLAGS.MANAGE_CHANNELS))) {
			console.log(`Removing mngr ${usr.id} of ${newChannel.id}.`);
			console.log(!mmbr.permissionsIn(newChannel).has(Discord.Permissions.FLAGS.MANAGE_CHANNELS));
			chn[indx][3] = "";
			chn = chn.map((a) => Array.from(a).join(";"));
			chn = [...new Set(chn)];
			await client.db.set("chnl" + x.id, chn.join(";"));
			// remove as manager.
			client.channels.cache.get(client.config.statics.defaults.channels.sflp).send({
				content: `Removing ${usr.id} as a manager of channel ${newChannel.id}`,
			});
			client.channels.cache.get(client.config.statics.defaults.channels.sflp).send({
				content: `${Math.trunc(Date.now() / 60_000)}: Successfully set chnl ${usr.tag}(${usr.id}) as ${chn.join(";")}`,
			});
		}

	});
	rmv.forEach(async (id) => {
		const usr = await client.config.fetchUser(id);
		const mmbr = await client.guilds.cache.get(newChannel.guildId).members.fetch({ user: usr.id, force: true });
		client.channels.cache.get(client.config.statics.defaults.channels.sflp).send({ content: `${Math.trunc(Date.now() / 60000)}: Attempting to remove chnl data for M:<${usr.tag} (${usr.id})> of ${newChannel.name} (id: ${newChannel.id})...` });
		let chn = await client.db.get("chnl" + id);
		// determine if member has any perms; `!chn` indicates no permissions.
		if (!chn) return;
		chn = client.config.listToMatrix(chn.split(";"), 4);
		const indx = chn.findIndex((f) => f.split(";")[0] == newChannel.id);
		const prevChnl = chn[indx];
		chn = chn.filter((f) => f[0] != newChannel.id);
		if (chn.length == 0) {
			const t = Date.now();
			await client.db.delete("chnl" + id);
			client.channels.cache.get(client.config.statics.defaults.channels.sflp).send({
				content: `
Audit log entry at ${new Date(audit.createdAt).toISOString()} by M:${audit.executor.tag}(${audit.executor.id})
Removed chnl ${usr.id} (time taken: ${t} ms)
`,
			});
		}
		else {
			chn = chn.map((f) => f.join(";"));
			await client.db.set("chnl" + id, chn.join(";"));
			client.channels.cache.get(client.config.statics.defaults.channels.sflp).send({
				content: `
Audit log entry at ${new Date(audit.createdAt).toISOString()} by M:${audit.executor.tag}(${audit.executor.id})
Can manage?: ${mmbr.permissionsIn(newChannel).has(Discord.Permissions.FLAGS.MANAGE_CHANNELS)} (member: ${usr.id}, channel: ${newChannel.id})
${!mmbr.permissionsIn(newChannel.id).has(Discord.Permissions.FLAGS.MANAGE_CHANNELS) && (prevChnl[4] == "mngr") ? `Removing ${usr.id} as a manager of channel ${newChannel.id}` : ""}
				`,
			});
		}
	});

	// only thing that we've missed is when someone's overwrites are fully taken out/removed.

});

client.once("ready", async () => {
	client.user.setPresence({
		activity: {
			name: `${client.guilds.cache.size} servers | ~support to join our support server for free 💵 500`,
			type: "WATCHING",
		},
		status: "dnd",
	});
	client.user.color = client.config.statics.defaults.clr;
	console.log(`\u2705 Logged in as ${client.user.tag}`);
	client.channels.cache.get(client.config.statics.defaults.channels.ready).send({ content: `[${new Date().toISOString()}]: instance created with ${client.guilds.cache.size} (U:${client.users.cache.size}) guilds cached` });
	try {
		await client.guilds.cache.get(client.config.statics.supportServer).members.fetch();
		client.channels.cache.get(client.config.statics.defaults.channels.ready).send({ content: `[${new Date().toISOString()}]: Successfully cached ${client.guilds.cache.get(client.config.statics.supportServer).members.cache.size}/${client.guilds.cache.get(client.config.statics.supportServer).memberCount} members of ${client.config.statics.supportServer}.` });
	}
	catch (e) {
		client.channels.cache.get(client.config.statics.defaults.channels.ready).send({ content: `[${new Date().toISOString()}]: **Failed to cache members of guild ${client.config.statics.supportServer}**, e: \`${e}\`` });
	}
});

client.on("guildCreate", async (g) => {
	client.user.setPresence({
		activity: {
			name: `${client.guilds.cache["size"]} servers | ~support to join our support server for free 💵 500`,
			type: "WATCHING",
		},
		status: "dnd",
	});
	client.channels.cache.get(client.config.statics.defaults.channels.guildLogs).send({
		content: `[${new Date().toISOString()}]<guildCreate>:${g.name} (id: ${g.id}, ownerId: ${g.ownerId}, verified?: ${g.verified})`,
	});
});

client.on("guildDelete", async (g) => {
	client.user.setPresence({
		activity: {
			name: `${client.guilds.cache.size} guilds | ~support to join our support server for free 💵 500`,
			type: "WATCHING",
		},
		status: "dnd",
	});
	client.channels.cache.get(client.config.statics.defaults.channels.guildLogs).send({
		content: `[${new Date().toISOString()}]<guildDelete>:${g.name} (id: ${g.id}, ownerId: ${g.ownerId}, verified?: ${g.verified}, cliJoinedAt: ${new Date(g.joinedTimestamp).toISOString()})`,
	});
});

client.on("guildMemberUpdate", async (oldMember, newMember) => {
	if (oldMember.guild.id != client.config.statics.supportServer) return;
	oldMember = await oldMember.fetch(true);
	newMember = await newMember.fetch(true);
	let cst = await client.db.get("cst" + newMember.id);
	cst = cst ? cst.split(";") : [];
	if (newMember.roles.cache.has(client.config.statics.defaults.roles.SERVER_BOOSTER) && (!cst.includes("booster"))) {
		cst.push("booster");
	}
	else if (cst.includes("booster")) {
		cst = cst.filter((x) => !["booster"].includes(x));
	}
	if (!newMember.nickname) {
		await client.db.delete("nick" + oldMember.user.id);
	}
	if (oldMember.nickname != newMember.nickname) {
		await client.db.set("nick" + oldMember.user.id, newMember.nickname);
	}
	const oldRoles = [...oldMember.roles.cache.keys()].filter((r) => r != newMember.guild.id);
	const newRoles = [...newMember.roles.cache.keys()].filter((r) => r != newMember.guild.id);
	client.config.statics.cstSpecials.forEach((s) => {
		cst = cst.map((f) => f == s[0] ? s[1] : f);
	});
	for (const f of cst) {
		if (oldRoles.includes(f) && (!newRoles.includes(f))) {
			cst = cst.filter((f0) => ![f].includes(f0));
		}
	}
	cst.push(newRoles.filter((f) => !oldRoles.includes(f)).join(";"));
	newRoles.forEach((f) => {
		if (!cst.includes(f)) cst.push(f);
	});
	for (const f in cst) {
		if (newMember.guild.roles.cache.get(cst[f]) && (!newRoles.includes(cst[f]))) cst = cst.filter((f0) => ![cst[f]].includes(f0));
	}
	cst = cst.filter((f) => !["", client.config.statics.defaults.roles.memberRole].includes(f));
	client.config.statics.cstSpecials.forEach((s) => {
		cst = cst.map((f) => f == s[1] ? s[0] : f);
	});
	// remove duplicates:
	cst = [...new Set(cst)];
	await client.db.set("cst" + newMember.id, cst.join(";"));
});

client.on("guildMemberAdd", async member => {
	if (member.guild.id != client.config.statics.supportServer) return;
	let cst = await client.db.get("cst" + member.id);
	cst = cst ? cst.split(";") : [];
	const channel = member.guild.channels.cache.get(client.config.statics.defaults.channels.general);
	const nick = await client.db.get("nick" + member.id);
	if (nick) await member.setNickname(nick);
	client.config.statics.ditems.forEach((i) => {
		if (cst.includes(i.split(";")[1]) && (!cst.includes(i.split(";")[2]))) {
			cst.push(i.split(";")[2]);
		}
	});
	client.config.statics.cstSpecials.forEach((i) => {
		if (cst.includes(i[0]) && (!cst.includes(i[1]))) {
			cst.push(i[1]);
		}
	});
	const rle = [client.config.statics.defaults.roles.memberRole];
	for (const f of cst) {
		if (member.guild.roles.cache.get(f)) rle.push(f);
	}
	member.roles.add(rle)
		.catch(() => {return;});
	let chn = await client.db.get("chnl" + member.id) || undefined;
	if (chn) {
		chn = client.config.listToMatrix(chn.split(";"), 4);
		chn.forEach(async (x) => {
			client.channels.cache.get(client.config.statics.defaults.channels.sflp).send(`${Math.trunc(Date.now() / 60000)}: Attempting to restore permissions for ${member.user.tag}(${member.user.id})>:\nchannel: ${x[0]} -> deny: ${x[1]}, allow: ${x[2]}, manager?: ${x[3]}`);
			try {
				client.channels.cache.get(x[0]).send({ content: `${Math.trunc(Date.now() / 60_000)}: Attempting to restore channel permissions for M(${member.id}) > data: ${x.join(";")}` });
			}
			catch (e) {
				return client.channels.cache.get(client.config.statics.defaults.channels.sflp).send(`${Math.trunc(Date.now() / 60_000)}: Disregarding permissionOverwrites.edit request from M:<${member.user.tag} (${member.id})>: \`No channel with ID "${x[0]}" found.\``);
			}
			// to prevent getting rate limited/ip banned
			// this function works by delaying the resolution of a Promise.
			await delay(1000);
			try {
				console.log(x);
				// returns Record<Discord.PermissionString, boolean>
				// eslint-disable-next-line no-undef
				const deny = new Discord.Permissions(BigInt(Number(x[1]))).serialize();
				// eslint-disable-next-line no-undef
				const allow = new Discord.Permissions(BigInt(Number(x[2]))).serialize();
				member.guild.channels.cache.get(x[0]).permissionOverwrites.edit(member.id, Object.assign({}, deny, allow));
				client.channels.cache.get(client.config.statics.defaults.channels.sflp).send(`${Math.trunc(Date.now() / 60_000)}: Successfully restored permissions for M:<${member.user.tag} (${member.id})>: ${x[0]} -> d: ${x[1]}, a: ${x[2]}`);
				client.channels.cache.get(x[0]).send(`Successfully restored permissions for M:<${member.user.tag} (${member.id})>: d: ${x[1]}, a: ${x[2]}`);
			}
			catch (e) {
				client.channels.cache.get(client.config.statics.defaults.channels.sflp).send(`${Math.trunc(Date.now() / 60_000)}: Unable to restore permissions for M:<${member.user.tag} (${member.id})>: data: ${x.join(";")}\nError: \`${e}\``);
			}
		});
	}
	if (cst.includes("cl")) {
		channel.send({ content: `♥️ Welcome back ${member}! Any nicknames, roles or channel-specific permissions you had when you left the server have been re-assigned.` });
	}
	else {
		channel.send({ content: `Welcome ${member} to ${member.guild.name}! :dollar: 500 have been added to your balance! I do hope you enjoy your stay ♥️` });
		const oldBal = await client.db.get("bal" + member.user.id) || 0;
		await client.db.set("bal" + member.user.id, oldBal + 500);
		cst.push("cl");
		await client.db.set("bal" + member.user.id, cst.join(";"));
		await client.db.set("cst" + member.id, cst.join(";"));
	}
	// refresh cst as something may have changed
	cst = await client.db.get("cst" + member.id);
	cst = cst ? cst.split(";") : [];
	let owner = await client.config.fetchUser(client.config.owner);
	owner = owner.tag;
	const blacklisted = await client.db.get("blacklist" + member.user.id);
	let mute = await client.db.get("mt" + member.id);
	if (mute) {
		mute = mute.split(";");
		if (mute[0] == "-1") {
			client.config.commands.get("mute")
				.run(client, { createdTimestamp: now, guild: member.guild, channel: channel, member: member.guild.member(client.user), author: client.user }, [member.id, "0", mute.slice(1).join(" ")]);
		}
		const date = Number(mute[0]);
		const now = Date.now() / 60_000;
		if (now < date) {
			const mins = date - now;
			client.config.commands.get("mute")
				.run(client, { createdTimestamp: now, guild: member.guild, channel: channel, member: member.guild.member(client.user), author: client.user }, [member.id, Math.round(mins), mute.slice(1).join(" ")]);
		}
		else if (member.roles.cache.has(client.config.statics.defaults.roles.muted) && (now >= date)) {
			// unmute
			client.config.commands.get("unmute")
				.run(client, { createdTimestamp: now, guild: member.guild, channel: channel, member: member.guild.member(client.user), author: client.user }, [member.id, "[automatic-unmute]: Time's up"]);
		}
	}
	if (Number(member.user.createdTimestamp) > Date.now() - 1209600000 || ([].includes(member.user.id)) || (blacklisted)) {
		client.channels.cache.get(client.config.statics.defaults.channels.modlogs).send({ content: `${Math.trunc(Date.now() / 60_000)}: mute: M:<${member.user.tag} (${member.id})>: anti-raid [M:<${client.user.tag} (${client.user.id})>]` });
		await member.roles.add(client.config.statics.defaults.roles.muted);
		await client.db.set("mt" + member.id, "-1;anti raid");
		channel.send({ embeds: [
			new Discord.MessageEmbed()
				.setColor(client.config.defaults.clr)
				.setDescription(`${member.user.tag} was given a 100000000 minute mute for "anti raid" and sent the following message:`),
		] });
		channel.send({ embeds: [
			new Discord.MessageEmbed()
				.setColor("#da0000")
				.setDescription(`You have received a 100000000 minute mute from ${member.guild.name} because of "[automatic-mute]: Anti-raid"`)
				.addField("Moderator", client.user.tag)
				.addField("Reason", `Your account was flagged as a potential threat to our server. If you believe that you were muted erroneously, please contact \`${owner}\`.`),
		] });
		member.send({ embeds: [
			new Discord.MessageEmbed()
				.setColor("#da0000")
				.setDescription(`You have received a 100000000 minute mute from ${member.guild.name} because of "[automatic-mute]: Anti-raid"`)
				.addField("Moderator", client.user.tag)
				.addField("Reason", `Your account was flagged as a potential threat to our server. If you believe that you were muted erroneously, please contact \`${owner}\`.`),
		] })
			.catch(() => {return;});
	}
	client.channels.cache.get(client.config.statics.defaults.channels.memberLog).send({ embeds: [
		new Discord.MessageEmbed()
			.setTimestamp()
			.setColor("#00FF0C")
			.setAuthor(member.user.tag, member.user.avatarURL())
			.setFooter(`Member Joined • ID: ${member.user.id}`, member.user.avatarURL()),
	] });
});

client.on("guildMemberRemove", async (member) => {
	if (member.guild.id == client.config.statics.supportServer) {
		client.channels.cache.get(client.config.statics.defaults.channels.memberLog).send({ embeds: [
			new Discord.MessageEmbed()
				.setTimestamp()
				.setColor("#da0000")
				.setAuthor(member.user.tag, member.user.avatarURL())
				.setFooter(`Member Left • ID: ${member.user.id}`,
					member.user.displayAvatarURL()),
		] });
	}
});

client.on("messageCreate", async (message) => {
	if (!message.author) return;
	let cst = await client.db.get("cst" + message.author.id) || "";
	cst = cst.split(";");
	if (!message.guild || (message.author.bot && (!cst.includes("wl"))) || (message.system) || (message.webhookId)) return;
	if (message.partial) message = await message.fetch();
	const prefix = await client.db.get("prefix" + message.guild.id) || client.config.statics.prefix;
	message.guild.prefix = prefix;
	if (message.guild.id == client.config.statics.supportServer) {
		if (/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/g.test(message.content.toLowerCase()) && (!cst.includes("linkp"))) {
			message.delete({ reason: "author posted an invite" });
			return client.config.commands.get("mute")
				.run(client, { guild: message.guild, channel: message.channel, member: message.guild.member(client.user), author: client.user }, [ message.author.id, "0", "posting server invites" ])
				.catch((f) => console.error(f));
		}
		if (message.channel.parentId != client.config.statics.defaults.channels.spamCat) {
			let rateLimit = collection.get(message.author.id) || 0;
			rateLimit = Number(rateLimit);
			collection.set(message.author.id, rateLimit + 1);
			if (rateLimit >= 5 && (!cst.includes("tmod"))) {
				const limit = "5/2s";
				await message.member.roles.add(client.config.statics.defaults.roles.muted);
				await client.db.set("mt" + message.author.id, `${(message.createdTimestamp + ms("10m")) - client.config.epoch};hitting the message send rate limit (${limit})`);
				const msg = `You have received a 10 minute mute from ${message.guild.name} because of hitting the message send rate limit (${limit}); please DM ${client.users.cache.get(client.config.owner).tag} if you beleive that this is a mistake. If you aren't unmuted after 10 minutes, then please contact a moderator and ask them to unmute you.`;
				client.config.commands.get("mute").run(client, message, [ message.author.id, 10, msg ]);
			}
			setInterval(() => collection.delete(message.author.id), 2_000);
		}
		let coold = await client.db.get("xpc" + message.author.id) || 0;
		coold = Number(coold);
		// eslint-disable-next-line no-empty
		if ((message.createdTimestamp / 60_000) < coold) {

		}
		else if (!cst.includes("noxp")) {
			// no cooldown; add xp.
			let xp = String(await client.db.get("xp" + message.author.id) || "1;0");
			xp = xp.split(";");
			xp[0] = Number(xp[0]);
			xp[1] = Number(xp[1]);
			xp[1] += client.config.getRandomInt(14, 35);
			if ((xp[1] / 200) > xp[0]) {
				message.reply({ content: `Congratulations, you've levelled up! You're now level **${xp[0] + 1}**! View your XP and level by typing \`${prefix}level\``, allowedMentions: { repliedUser: false } });
				xp[0] += 1;
			}
			await client.db.set("xp" + message.author.id, xp.join(";"));
			await client.db.set("xpc" + message.author.id, (message.createdTimestamp / 60_000) + 1);
		}
		if (message.mentions.members.size + message.mentions.users.size + message.mentions.roles.size > 5) {
			client.config.commands.get("mute").run(client, message, [ message.author.id, "0", "[automatic-mute]: Mass Mention" ]);
		}
	}

	const bal = await client.db.get("bal" + message.author.id) || "0";
	const chp = await client.db.get("chillpills" + message.author.id) || "0";
	let fish = await client.db.get("fsh" + message.author.id) || "0;0;0;0;0";
	fish = fish.split(";");
	message.content = message.content
		.replace(/myid/g, message.author.id)
		.replace(/allmoney/g, bal)
		.replace(/alldolphin/g, fish[0])
		.replace(/allshark/g, fish[1])
		.replace(/allblowfish/g, fish[2])
		.replace(/alltropical/g, fish[3])
		.replace(/allfish/g, fish[4])
		.replace(/allchp/g, chp);
	const replacers = await client.db.get("replacers" + message.author.id) || {};
	if (replacers && (typeof replacers === "object")) {
		for (const x in replacers) {
			if (!replacers[x].content) continue;
			message.content = message.content.replace(new RegExp(`{${x}}`, "gm"), replacers[x].content);
		}
	}
	const rand = Math.floor(Math.random(1) * 10);
	if (rand < 2) {
		if (rand > 7) {
			await client.db.set(`briefcase${message.channel.id}`, true);
			message.channel.send({
				content: `Someone just dropped their :briefcase: briefcase in this channel! Hurry up and steal it with \`${prefix}steal\``,
			});
		}
	}

	message.author.debug = cst.includes("debugger");
	if (!message.content.startsWith(prefix)) return;
	if (message.author.debug != false) {
		message.reply({
			embeds: [
				new Discord.MessageEmbed()
					.setColor(message.author.color)
					.setTitle("Message content parsed as:")
					.setDescription("```\n" + message.content + "\n```"),
			],
		});
	}
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.config.commands.get(commandName) || client.config.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
	const stnb = await client.db.get("stnb" + message.author.id) || "stunned";
	if (cst.includes("pstn") && (!cst.includes("antistun"))) {
		return message.reply({ content: `You can't do anything while you're ${stnb}! (${Math.round(message.createdTimestamp / 60_000)} minutes left)` });
	}
	if (!command || (command)) {
		const k = command ? command.name : commandName || "";
		// todo: make a <Command>.usableWS? : <Boolean> - stands for command.useableWhileStunned?<Boolean>
		if (!["punish", "unpunish", "offences", "ban", "mute", "unmute", "warn"].includes(k)) {
			let stun = await client.db.get("stn" + message.author.id);
			if (stun && (!cst.includes("antistun"))) {
				stun = Number(stun) * 60_000;
				if (stun - message.createdTimestamp >= 1000) {
					return message.reply({ content: `You can't do anything while you're ${stnb}! (${client.config.cooldown(message.createdTimestamp, stun)} left)` });
				}
			}
		}
	}

	for (const arg in args) {
		const data = args[arg];
		if (!isNaN(data.replace("&", ""))) {
			const digits = "0".repeat(Number(data.split("&")[1]));
			args[arg] = `${data.split("&")[0]}${digits}`;
		}
		else if (data.split("|")) {
			if (!isNaN(args[arg].split("|")[1])) {
				args[arg] = args[arg].split("|")[0].repeat(Number(args[arg].split("|")[1]));
			}
		}
	}

	if (command) {
		message.author.color = await client.db.get("clr" + message.author.id) || `${client.config.statics.defaults.clr};0`;
		message.author.colors = message.author.color.split(";");
		const m = message.author.color.split(";");
		if (isNaN(m[m.length - 1])) m[m.length - 1] = "0";
		if (Number(m[m.length - 1]) + 1 >= (m.length - 1)) {
			m[m.length - 1] = "0";
		}
		else {
			m[m.length - 1] = Number(m[m.length - 1]) + 1;
		}
		await client.db.set("clr" + message.author.id, m.join(";"));
		message.author.color = message.author.color.split(";")[Number(m[m.length - 1])];
	}
	if (!command) return;
	let bcmd = await client.db.get(`bcmd${message.author.id}`) || "";
	bcmd = bcmd.split(";");
	if (bcmd.includes(command.name) && (!cst.includes("administrator132465798"))) {
		// this allows for blacklisting of specific commands. Practically speaking, it is very useful as it allows me (or any other admin) to prevent users who are spamming a command from doing so.
		return message.reply("You do not have permissions to use that command!");
	}

	if (!collection.has(command.name)) {
		collection.set(command.name, new Discord.Collection());
	}

	// 5s command cooldown for each user, can be bypassed if they have a specific permission.
	// this exists to prevent spam/misuse
	const timestamps = collection.get(command.name);
	if (timestamps.has(message.author.id) && (!cst.includes("rebel"))) {
		const expirationTime = timestamps.get(message.author.id) + 5000;
		if (message.createdTimestamp < expirationTime) {
			const timeLeft = (expirationTime - message.createdTimestamp) / 1000;
			return message.reply(`You must wait another ${timeLeft.toFixed(1)} seconds before using another command!`);
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
				new Discord.MessageEmbed()
					.setColor("#da0000")
					.setTitle("[DEBUGGER]: Sorry, but an error occured :/")
					.setDescription(`\`\`\`\n${e.stack}\n\`\`\``),
			],
			});
		}
	}

	const old = await client.db.get("cmds" + client.user.id) || "0";
	await client.db.set("cmds" + client.user.id, Number(old) + 1);
	let LOG = `[${old + 1}] ${Math.trunc(message.createdTimestamp / 60000)}: (${message.guild.name}(${message.guild.id}))[${message.channel.name}]<${message.author.tag}(${message.author.id})>: ${message.content}\n`;
	try {
		await command.run(client, message, args);
	}
	catch (e) {
		client.channels.cache.get(client.config.statics.defaults.channels.error).send({
			content: `Exception at ${new Date().toISOString()} (type: caughtError, onCommand?: true; sent to console):\n\`${e}\``,
			embeds: [
				new Discord.MessageEmbed()
					.setColor(client.config.statics.defaults.colors.invisible)
					.setDescription(LOG),
				// embed description has a max of 4k chars, very very unlikely that a normal message sent by a user will ever exceed that
			],
		});
		err(e);
	}
	LOG = Discord.Util.splitMessage(LOG, { maxLength: 2_000, char: "" });
	try {
		const Old = await client.db.get("cmds" + message.author.id) || 0;
		await client.db.set("cmds" + message.author.id, Number(Old + 1));
	}
	catch (err) {
		client.channels.cache.get(client.config.statics.defaults.channels.err).send({
			content: `${message.createdTimestamp / 60_000}: error while updating db values "cmds${message.author.id}"`,
		});
	}
	if (command && (!message.emit)) {
		// prevents commands executed by another using from being logged. Helps cut down on spam and unnecessary logging.
		LOG.forEach(async (cntnt) => {
			await client.channels.cache.get(client.config.statics.defaults.channels.cmdLog).send({ content: cntnt, allowedMentions: { parse: [] } });
		});

		if (command.logAsAdminCommand || (command.cst == "administrator132465798")) {
			const today = new Date(message.createdTimestamp).toISOString().split("T")[0].split("-").reverse().join("-");
			// today example: 13-12-2021 (for: 13 Dec 2021)
			if (!fs.existsSync(`./.adminlogs/${today}`)) {
				const b = Date.now();
				client.channels.cache.get(client.config.statics.defaults.channels.adminlog).send({ content: "Attempting to create new logs file..." });
				fs.writeFile(`./.adminlogs/${today}`, LOG.join(""), ((err) => {
					if (err) console.error(err) && client.channels.cache.get(client.config.statics.defaults.channels.adminlog).send({ content: `Error whilst creating new logs file: \`${err}\`` });
					client.channels.cache.get(client.config.statics.defaults.channels.adminlog).send({ content: `Created new logs file in ${Date.now() - b} ms` });
				}));
			}
			else {
				fs.createWriteStream(`./.adminlogs/${today}`, { flags: "a" }).end(LOG.join(""));
			}
			await delay(100);
			// delaying ensures that the log message is sent AFTER writing to the txt file.
			LOG.forEach(async (cntnt) => {
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
});

/**
 * * Used to send an error to the exceptions channel. (This is also sent to the console.)
 * * The function name is capitalised in order to prevent me from overusing it (yeah, I'm that lazy)
 * * This function was not able to go in the `config.js` file due to certain complications
 * @param {String} e exception that is to be recorded
 * @param {?String} msgCont message content (only if this was used in a command - really helps with debuggging)
 */
client.Notify = function(e, msgCont) {
	const rn = new Date().toISOString();
	console.error(e);
	if (!msgCont) {
		client.channels.cache.get(client.config.statics.defaults.channels.error).send({
			content: `Exception at ${rn} (type: unhandledRejection, sent to console):\n\`${e}\``,
			// very unliekly that a normal exception/error will exceed 2,000 characters in length.
		}).catch(() => {return;});
		// to prevent messageSendFailure erros from throwing. They flood the console and often I can't do anything about it so it's better to just ignore those.
	}
	else {
		client.channels.cache.get(client.config.statics.defaults.channels.error).send({
			content: `Exception at [${rn}] (type: unhandledRejection, sent to console):\n\`${e}\``,
			embeds: [
				new Discord.MessageEmbed()
					.setColor("#da0000")
					.setDescription(msgCont),
			],
		})
			.catch(() => {return;});
	}
};


// debugs and warns
process
	.on("unhandledRejection", e => client.Notify(e));

client
	.on("error", client.Notify)
	.on("warn", client.Notify)
	.on("debug", async (dbg) => {
		/**
		 * Oirginally when I first tried using the client.Notify function here, it errored out saying: `TypeError: Cannot read properties of undefined (reading 'send')`. This error means that the client couldn't find the channel, which was awkward since it was getting the correct channel ID (hence the commented out console.log statement-that's me checking if the func is actually getting the right channel ID).
		 * As it wasn't an issue with the ID, it had to be an issue wit the Client not getting the channel from Discord. I had a read of the [discord.js documentation](https://discord.js.org/#/docs/main/stable/general/welcome) and realised that this event must...
		 * send the debug message via a webhook and NOT the client because this event will emit before the client is ready, and since this relied on the client, it became an issue as the client hadn't loaded yet.
		 * Thus, a webhook is used instead. A webhook has, in essence, is only used to send a message via a single HTTP POST request, and is independent to the client itself. This isn't really much of an issue, and is only really apparent here.
		 * -I've added it to the config.js file anyway, simply because I would like to keep such conf values in one place, where I can easily manage them.
		 */
		const webh = new Discord.WebhookClient({ url: client.config.statics.defaults.webhooks.debugger });
		const send = Discord.Util.splitMessage(dbg, { maxLength: 2_000, char: "" });

		send.forEach(async (message) => {
			await webh.send({
				content: "`" + message + "`",
			});
		});
	});

client.login(process.env.token);