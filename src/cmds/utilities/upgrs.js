"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "upgrs",
	aliases: ["upgrs", "assigns", "ccmds"],
	description: "View a list of assignable upgrades",
	async run(client, message, args) {
		const upgr = message.author.data.get("upgr");
		if (!upgr || upgr?.split(";").length < 2) return message.reply("You have no assignable upgrades!");
		const keys = client.utils.listToMatrix(upgr.split(";"), 2).map((f) => f[0]);
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setTitle(`${message.author.tag}'s Assignable Upgrades`)
					.setDescription("```\n" + client.utils.Inspect(keys) + "\n```"),
			],
		});
	},
};