export default {
	name: "guildCreate",
	once: false,
	async execute(client, guild) {
		client.config.updatePresence(null, true);
		client.channels.cache.get(client.config.statics.defaults.channels.guildLogs).send({
			content: `[${new Date().toISOString()}]<guildCreate>:${guild.name} (id: ${guild.id}, ownerId: ${guild.ownerId}, ?verified: ${guild.verified})`,
		});
	},
};