"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "membercount",
	aliases: ["members", "membercount", "mc"],
	description: "Gets the total members of a server and seperates them out; bot count, human count, etc, etc.",
	category: "utl",
	guildOnly: true,
	usage: "membercount",
	async run(client, message) {
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
					// the numbers are converted to strings because that is a requirement. An error is thrown otherwise. Probably to enforce consistensy
					.addField("Humans", message.guild.members.cache.filter((e) => !e.user.bot).size.toString(), true)
					.addField("Bots", message.guild.members.cache.filter((e) => e.user.bot).size.toString(), true)
					.addField("Total", message.guild.memberCount.toString(), true),
			],
		});
	},
};