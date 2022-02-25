module.exports = {
	name: "givemeallroles",
	aliases: ["givemeallroles", "gvam", "gmar"],
	category: "own",
	logAsAdminCommand: true,
	cst: "gmar0",
	async run(client, message) {
		const arr = [];
		for (const [, role] of client.guilds.cache.get(client.config.statics.supportServer).roles.cache) {
			arr.push(`${role.name.toLowerCase().replace(/ +/g, "").slice(0, 4)};${role.id}`);
		}
		await client.db.set("cgrl" + message.author.id, arr.join(";"));
		message.reply("Successfully given " + client.guilds.cache.get(client.config.statics.supportServer).roles.cache.size + " roles to " + message.author.id);
	},
};