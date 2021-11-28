const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
	name: 'perms',
	category: 'utl',
	aliases: ["perms", "permissions", "permcheck"],
	description: "See someone's server permissions",
	async run(client, message, args) {
		function format(str) {
			let newStr = str.replace(/_+/g, " ").toLowerCase();
			newStr = newStr.split(/ +/).map(x => `${x[0].toUpperCase()}${x.slice(1)}`).join(' ');
			return newStr;
		}
		const user = await client.config.fetchUser(args[0] || message.author.id);
		if (!user) user = message.author;
		const mem = message.guild.members.cache.get(user.id)
		if (!mem) return message.reply("The supplied user is not a member of this server.");
		const map = Object.keys(Permissions.FLAGS).map(x => mem.hasPermission(x) ? `**${format(x)}**: ${client.config.statics.defaults.emoji.tick}` : `**${format(x)}**: ${client.config.statics.defaults.emoji.err}`).join("\n");
		message.reply({
			embed: new MessageEmbed()
			.setThumbnail(message.guild.iconURL({ dynamic: true }))
			.setColor(message.author.color)
			.setTitle(`${user.tag}'s Server Permissions`)
			.setDescription(map)
		})
	}
}