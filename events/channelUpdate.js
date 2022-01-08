import { Permissions } from "discord.js";

export default {
	name: "channelUpdate",
	once: false,
	async execute(client, oldChannel, newChannel) {
		if (["DM", "GROUP_DM"].includes(oldChannel.type) || (oldChannel.guild.id != client.const.supportServer)) return;
		// ensure that the user is still in the server. If yes, then edit data.
		// fetch full structure from Discord API
		// Only the partial structure is sent through the event.
		const audit = (await oldChannel.guild.fetchAuditLogs({ limit: 1, type: "CHANNEL_UPDAYE" })).entries.first();
		const oldPerms = [...oldChannel.permissionOverwrites.cache.values()].filter((d) => d.type == "member");
		const newPerms = [...newChannel.permissionOverwrites.cache.values()].filter((d) => d.type == "member");
		// if below statement is true, then the channel permissionOverwrites have not changed.
		// this had to be added to prevent this event from emitting randomly whenever a different property of a channel was updated (e.g. slowmode, name change, etc.)
		if (Object.entries(client.utils.Inspect(oldPerms)).join(";") === Object.entries(client.utils.Inspect(newPerms)).join(";")) return;
		const rmv = [];
		for (const x in oldPerms) {
			const member = await newChannel.guild.members.fetch({ user: x.id, force: true }).catch(() => {return;});
			if (!member) continue;
			if (!newPerms.map(({ id }) => id).includes(oldPerms[x].id)) {
				rmv.push(oldPerms[x].id);
			}
			else {continue;}
		}
		newPerms.forEach(async (x) => {
			const usr = await client.utils.fetchUser(x.id);
			const mmbr = await client.guilds.cache.get(newChannel.guildId).members.fetch({ user: usr.id, force: true });
			const wasManager = oldChannel.permissionOverwrites.cache.find(({ id }) => id === x.id) ? oldChannel.permissionOverwrites.cache.find(({ id }) => id == x.id).allow.has(Permissions.FLAGS.MANAGE_CHANNELS, false) || false : false;
			const isManager = mmbr.permissionsIn(newChannel).has(Permissions.FLAGS.MANAGE_CHANNELS, false);
			let addingManager = false;
			let removingManager = false;
			if (!wasManager && (isManager)) addingManager = true;
			if (wasManager && (!isManager)) removingManager = true;
			console.log("!wasManager", !wasManager);
			console.log("wasManager", wasManager);
			console.log("isManager", isManager);
			console.log("addingManager?: " + addingManager);

			const user = await client.db.getUserData(x.id);
			let chn = user.get("chnl");
			chn = chn ? client.utils.listToMatrix(chn.split(";"), 3) : [];
			let indx = chn.findIndex((data) => data[0] == newChannel.id);
			if (indx < 0) {
				// add new data.
				chn.push([newChannel.id, x.deny.bitfield, x.allow.bitfield]);
				indx = chn.length - 1;
			}
			else if (chn[indx].join(";") == `${newChannel.id};${x.deny.bitfield};${x.allow.bitfield}`) {
				// ignore
				client.channels.cache.get(client.const.channels.sflp).send({ content: `Audit log entry at ${new Date(audit.createdAt).toISOString()} by ${audit.executor.tag}(${audit.executor.id}) in regard to ${usr.tag}(${usr.id}) was ignnored due to data already matching.\nEntry: ${newChannel.id};${x.deny.bitfield};${x.allow.bitfield}` });
				return;
			}
			else {
				// not a complete match; update values.
				chn[indx][1] = x.deny.bitfield;
				chn[indx][2] = x.allow.bitfield;
			}
			client.channels.cache.get(client.const.channels.sflp).send({
				content: `
	Audit log entry executed at ${new Date(audit.createdAt).toISOString()} by M:${audit.executor.tag} (${audit.executor.id})
	Can manage: ${mmbr.permissionsIn(newChannel).has(Permissions.FLAGS.MANAGE_CHANNELS)} (member: ${usr.id}, channel: ${newChannel.id}, allow: ${x.allow.bitfield}, deny: ${x.deny.bitfield})
	${addingManager ? `Adding ${usr.id} as a manager of ${newChannel.id}` : ""}${removingManager ? `Removing ${x.id} as a manager of ${newChannel.id}` : ""}
				`,
			});
			console.log([...new Set(chn.map((e) => Array.from(e).join(";")))].join(";"));
			await client.db.USERS.update({
				chnl: [...new Set(chn.map((e) => Array.from(e).join(";")))].join(";"),
			}, {
				where: {
					id: x.id,
				},
			});
		});

		rmv.forEach(async (id) => {
			const usr = await client.utils.fetchUser(id);
			const mmbr = await client.guilds.cache.get(newChannel.guildId).members.fetch({ user: usr.id, force: true }).catch(() => {return;});
			if (!mmbr) return;
			client.channels.cache.get(client.const.channels.sflp).send({
				content: `
	Audit log entry executed at ${new Date(audit.createdAt).toISOString()} by M:${audit.executor.tag} (${audit.executor.id})
	Can manage: ${mmbr.permissionsIn(newChannel).has(Permissions.FLAGS.MANAGE_CHANNELS)} (member: ${usr.id}, channel: ${newChannel.id})
	Removing permissions for ${id} in ${newChannel.id} (k: chnl)
				`,
			});
			const user = await client.db.getUserData(id);
			let chn = user.get("chnl");
			// determine if member has any perms; `!chn` indicates no permissions.
			if (!chn) return;
			chn = client.utils.listToMatrix(chn.split(";"), 3);
			const indx = chn.findIndex((f) => f[0] == newChannel.id);
			if (!indx) return;
			chn = chn.filter((f) => f[0] != newChannel.id);
			if (chn.length == 0) {
				await client.db.USERS.update({
					chnl: null,
				}, {
					where: {
						id: usr.id,
					},
				});
			}
			else {
				chn = chn.map((f) => f.join(";"));
				await client.db.USERS.update({
					chnl: chn.join(";"),
				}, {
					where: {
						id: usr.id,
					},
				});
			}
		});
	},
};