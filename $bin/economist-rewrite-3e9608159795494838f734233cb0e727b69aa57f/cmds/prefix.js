const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
	name: "prefix",
	aliases: ["prefix"],
	description: "Edits the server prefix",
	category: "utl",
	async run(client, message, args) {
		if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.reply("You need the `MANAGE_GUILD` permission in order to use this command!");
		const prefix = args[0].trim();
		if (!prefix || prefix.length > 3) return message.reply(`Invalid argument "${args[0]}"; this may not exceed 3 characters in length.`, { alloweMentions: { parse: [] } });
		await client.db.set(`prefix${message.guild.id}`, prefix.toLowerCase());
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has successfully updated the server prefix to \`${prefix.toLowerCase()}\``),
			],
		});
		client.channels.cache.get(client.config.statics.defaults.channels.pfx).send(`[${new Date().toISOString()}]: (${message.guild.name} (${message.guild.id}))<${message.author.tag}(${message.author.id})>: ${message.content}`);
	},
};