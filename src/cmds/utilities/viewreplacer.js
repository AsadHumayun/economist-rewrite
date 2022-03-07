"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "viewreplacer",
	aliases: ["viewreplacer"],
	description: "view a stored replacer's content",
	async run(client, message, args) {
		const kw = args[0].toLowerCase();
		const data = message.author.data.get("replacers") ? JSON.parse(message.author.data.get("replacers")) : {};
		if (!Object.keys(data).includes(kw)) {
			return message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author["color"])
						.setDescription(`No replacer named "${kw}" found. Look in \`${message.guild ? message.guild.prefix : client.const.prefix}replacers\` to view a list`),
				],
			});
		}
		else {
			message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setAuthor({ name: `Replacer Content - ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
						.setTitle(kw)
						.setDescription(String(data[kw])),
				],
			});
		}
	},
};