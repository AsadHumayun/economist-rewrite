"use strict";
import { Permissions, MessageEmbed } from "discord.js";

export default {
	name: "perms",
	category: "utl",
	aliases: ["perms", "permissions", "permcheck"],
	description: "See someone's server permissions",
	async run(client, message, args) {
		function format(str) {
			let newStr = str.replace(/_+/g, " ").toLowerCase();
			newStr = newStr.split(/ +/).map(x => `${x[0].toUpperCase()}${x.slice(1)}`).join(" ");
			return newStr;
		}
		const user = await client.utils.fetchUser(args[0] || message.author.id);
		const mem = message.guild.members.cache.get(user.id);
		if (!mem) return message.reply(`U: ${user.username}(${user.id}) is not a member of this server`);
		const map = Object.keys(Permissions.FLAGS).map((x) => mem.permissions.has(Permissions.FLAGS[x]) ? `**${format(x)}**: ${client.const.emoji.tick}` : `**${format(x)}**: ${client.const.emoji.err}`).join("\n");
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setAuthor({ name: `${user.tag}'s Server Permissions`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
					.setThumbnail(message.guild.iconURL({ dynamic: true }))
					.setDescription(map),
			],
		});
	},
};