"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "cstmrl",
	category: "utl",
	ssOnly: true,
	aliases: ["cstmrl", "cstmrls", "roles", "cgrl"],
	description: "Lists all of your assignable roles along with their keywords and names",
	async run(client, message) {
		let roles = message.author.data.get("cstmrl");
		if (!roles) return message.reply(`${client.config.statics.defaults.emoji.err} You do not own any custom roles.`);
		roles = client.config.listToMatrix(roles.split(";"), 2);
		const resp = roles.map((x) => `    "${x[0]}": "${message.guild.roles.cache.get(x[1]) ? message.guild.roles.cache.get(x[1]).name : "<UNKNOWN ROLE>"}"`).join(",\n");
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setTitle(`${message.author.tag}'s Custom Roles (${roles.length} currently owned)`)
					.setDescription(`You may assign roles displayed here to users in the support server\n\`${message.guild.prefix}role <role> <user>\` to add/remove a role from a user (support server only)\n\`${message.guild.prefix}rolecolor <role> <color>\` to edit a role's colour\n\`${message.guild.prefix}rolename <role> <new name>\` to edit a role's name\`\`\`\n{\n${resp || "[ NONE lol ]"}\n}\n\`\`\``),
			],
		});
	},
};