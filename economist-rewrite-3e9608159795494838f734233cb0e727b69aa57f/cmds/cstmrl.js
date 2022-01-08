const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "cstmrl",
	category: "utl",
	ssOnly: true,
	aliases: ["cstmrl", "cstmrls", "roles", "cgrl"],
	description: "Lists all of your assignable roles along with their keywords and names",
	async run(client, message, args = []) {
		if (!args.length) args[0] = message.author.id;
		let usr = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!usr) usr = message.author;
		let roles = await client.db.get("cgrl" + message.author.id);
		if (!roles) return message.reply(`${client.config.statics.defaults.emoji.err} You do not own any custom roles.`);
		roles = client.config.listToMatrix(roles.split(";"), 2);
		const resp = roles.map((x) => `    "${x[0]}": "${message.guild.roles.cache.get(x[1]) ? message.guild.roles.cache.get(x[1]).name : "<UNKNOWN ROLE>"}"`).join(",\n");
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setTitle(`${usr.tag}'s Custom Roles (${roles.length} currently owned)`)
					.setDescription(`You may assign roles displayed here to users in the support server\n\`${message.guild ? message.guild.prefix : client.const.prefix}role <role> <user>\` to add/remove a role from a user (support server only)\n\`${message.guild ? message.guild.prefix : client.const.prefix}rolecolor <role> <color>\` to edit a role's colour\n\`${message.guild ? message.guild.prefix : client.const.prefix}rolename <role> <new name>\` to edit a role's name\`\`\`\n{\n${resp || "[ NONE lol ]"}\n}\n\`\`\``),
			],
		});
	},
};