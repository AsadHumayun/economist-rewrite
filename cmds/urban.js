"use strict";
import { MessageEmbed } from "discord.js";
import fetch from "node-fetch";

export default {
	name: "urban",
	aliases: ["urban", "define"],
	category: "utl",
	description: "Search the urban dictionary for something. It will show the first given result/definition. Can only be used in NSFW channels.",
	usage: "urban <word>",
	async run(client, message, args) {
		if (!args.length) {
			return message.reply("You must include a search term in order for this command to work!");
		}
		const query = encodeURIComponent(args.join(" "));

		const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`, { method: "GET" }).then((res) => res.json());
		if (!list) {
			return message.reply("I cannot find that word!");
		}
		const [answer] = list;
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setTitle(answer.word)
					.setURL(answer.permalink)
					.addField("Definition", client.utils.trim(answer.definition, 1024))
					.addField("Example", answer.example ? `\`\`\`css\n${client.utils.trim(answer.example, 1000)}\n\`\`\`` : "```\nNo example found\n```")
					.setFooter(`👍 ${client.utils.comma(answer.thumbs_up)} | 👎 ${client.utils.comma(answer.thumbs_down)}`),
			],
		});
	},
};