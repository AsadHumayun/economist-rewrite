"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "replacers",
	aliases: ["replacers", "supplanters"],
	description: "View all of your currently active replacers.",
	async run(client, message) {
		const data = message.author.data.get("replacers") ? JSON.parse(message.author.data.get("replacers")) : {};
		let count = 1;
		const msg = Object.entries(data).map(x => `#${count++} \`${x[0]}\`: ${client.utils.trim(x[1], 50)}`).join("\n");
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setTitle(`${message.author.tag}'s Installed Supplanters`)
					.setDescription(`Replacers allow you to quickly supplant text within your messages with pre-inputted text. The names listed below must be enclosed in curly brackets (\`{}\`) before they will work!\n\n${msg}`),
			],
		});
	},
};