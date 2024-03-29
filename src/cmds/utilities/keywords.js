"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "keywords",
	aliases: ["keywords", "shortcuts"],
	description: "Shows you a list of the bot's keywords. These are enabled by default and cannot be disabled.",
	async run(client, message) {
		const kws = ["allmoney", "alldolphin", "allshark", "allblowfish", "alltropical", "allfish", "allchp"];
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setTitle("Shortcuts")
					.setDescription(
						`
					Here's a list of keywords which the bot automatically replaces in every message it receives. Note that these cannot be disabled and are the same for everyone.
					You can use these interchangeably between commands. For example, \`${message.guild ? message.guild.prefix : client.const.prefix}pay @User#1234 allmoney\` will pay User#1234 all of the author's balance.

					${kws.map((x) => "`" + x + "`").join(", ")}
					`,
					),
			],
		});
	},
};