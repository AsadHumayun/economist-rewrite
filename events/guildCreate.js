export default {
	name: "guildCreate",
	once: false,
	async execute(client, guild) {
		client.utils.updatePresence(null, true);
		client.channels.cache.get(client.const.channels.guildLogs).send({
			content: `[${new Date().toISOString()}]<guildCreate>:${guild.name} (id: ${guild.id}, ownerId: ${guild.ownerId}, ?verified: ${guild.verified})`,
		});
	},
};