export default {
	name: "channelCreate",
	once: false,
	async execute(client, channel) {
		if (["DM", "GROUP_DM"].includes(channel.type) || (channel.guild.id != client.config.statics.supportServer)) return;
		const audit = (await channel.guild.fetchAuditLogs({ limit: 1, type: "CHANNEL_CREATE" })).entries.first();
		const channelPermissions = [...channel.permissionOverwrites.cache.values()].filter((d) => d.type == "member");
		channelPermissions.forEach(async (x) => {
			const usr = await client.config.fetchUser(x.id);
			const user = await client.db.getUserData(usr.id);
			let chn = user.get("chnl");
			chn = chn ? client.config.listToMatrix(chn.split(";"), 3) : [];
			// a new channel is being created, therefore we don't need to check to see if a previous entry exists (it's not easy to guess the snowflake accurately and correctly)
			chn.push([channel.id, x.deny.bitfield, x.allow.bitfield]);
			client.channels.cache.get(client.config.statics.defaults.channels.sflp).send({
				// "[false]" because false is implied (as users cannot edit specific perms on channelCreate -- only thing that they can edit is ability to view, not manage).
				content: `
	Audit log entry executed at ${new Date(audit.createdAt).toISOString()} by M:${audit.executor.tag}(${audit.executor.id})
	Can manage: [false] (member: ${usr.id}, channel: ${channel.id}, allow: ${x.allow.bitfield}, deny: ${x.deny.bitfield})
				`,
			});
			chn = chn.map((a) => Array.from(a).join(";"));
			chn = [...new Set(chn)];
			await client.db.USERS.update({
				chnl: chn.join(";"),
			}, {
				where: {
					id: x.id,
				},
			});
			client.channels.cache.get(client.config.statics.defaults.channels.sflp).send({ content: `${Math.trunc(Date.now() / 60000)} U:<${usr.tag} (${usr.id})>: Successfully set chnl as ${client.config.trim(chn.join(";"), 1900)} ` });
		});
	},
};