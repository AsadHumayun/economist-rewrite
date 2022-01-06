export default {
	name: "guildDelete",
	once: false,
	async execute(client, guild) {
		client.channels.cache.get(client.config.statics.defaults.channels.guildLogs).send({
			content: `[${new Date().toISOString()}]<guildDelete>:${guild.name} (id: ${guild.id}, ownerId: ${guild.ownerId}, joinedAt: ${new Date(guild.joinedTimestamp).toISOString()})`,
		});
	},
};