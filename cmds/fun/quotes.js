"use strict";
import { Util, MessageEmbed } from "discord.js";

export default {
	name: "quotes",
	aliases: ["quotes"],
	descripton: "Shows you all of your quotations.",
	async run(client, message) {
		const qts = message.author.data.get("qts").split(";");
		if (!qts.length) return message.reply("You have no quotes");
		const embeds = Util.splitMessage(qts.map((v, i) => `${i + 1}: ${v}`).join("\n"), { maxLength: 4096, char: "" });
		for (const embed of embeds) {
			message.reply({
				embeds: [
					new MessageEmbed()
						.setTitle(`${message.author.tag}'s Quotes [${qts.length}]`)
						.setColor(message.author.color)
						.setDescription(embed),
				],
			});
		}
	},
};