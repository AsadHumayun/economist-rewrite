export default {
	name: "ready",
	once: false,
	async execute(client) {
		console.log(`\u2705 Logged in as ${client.user.tag}`);
		client.channels.cache.get(client.config.statics.defaults.channels.ready).send({ content: `[${new Date().toISOString()}]: instance created with ${client.guilds.cache.size} (U:${client.users.cache.size}) guilds cached` });
		// cache support server guild members.
		try {
			client.guilds.cache.get(client.config.statics.supportServer).members.fetch();
			client.emit("debug", `[CLIENT => Cache] [GuildMember] ${client.guilds.cache.get(client.config.statics.supportServer).members.cache.size}/${client.guilds.cache.get(client.config.statics.supportServer).memberCount} members of ${client.config.statics.supportServer} cached`);
		}
		catch (e) {
			client.emit("debug", `[CLIENT => Cache] [GuildMember] [CacheFailure] Failed to cache members of guild ${client.config.statics.supportServer}.\nError: ${e}`);
		}
		client.user.color = client.config.statics.defaults.clr;
		client.user.data = await client.db.getUserData(client.user.id);
	},
};