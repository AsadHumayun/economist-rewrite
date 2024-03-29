export default {
	name: "ready",
	once: false,
	async execute(client) {
		process.logger.success("READY", `Logged in as ${client.user.tag}`);
		client.utils.updatePresence(null, true);
		client.channels.cache.get(client.const.channels.ready).send({ content: `[${new Date().toISOString()}]: instance created with ${client.guilds.cache.size} (U:${client.users.cache.size}) guilds cached` });
		// cache support server guild members.
		try {
			await client.guilds.cache.get(client.const.supportServer).members.fetch();
			client.emit("debug", `[Client => Cache] [GuildMember] ${client.guilds.cache.get(client.const.supportServer).members.cache.size}/${client.guilds.cache.get(client.const.supportServer).memberCount} members of ${client.const.supportServer} cached`);
		}
		catch (e) {
			client.emit("debug", `[Client => Cache] [GuildMember] [CacheFailure (on 'ready')]: Failed to cache members of guild ${client.const.supportServer}.\nError: ${e}`);
		}
		await client.users.fetch(client.const.display);
		client.user.color = client.const.clr;
		client.user.data = await client.db.getUserData(client.user.id);
	},
};