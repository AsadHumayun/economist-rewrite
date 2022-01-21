"use strict";
import { MessageEmbed, Permissions } from "discord.js";
import fetch from "node-fetch";

export default {
	name: "cat",
	aliases: ["cat"],
	description: "Get a picture of a random cat",
	usage: "cat",
	async run(client, message) {
		if (!message.guild.me.permissions.has(Permissions.FLAGS.EMBED_LINKS)) {
			return message.reply("I need the Embed Links permission for this command to work.");
		}
		const [{ url }] = await fetch("https://api.thecatapi.com/v1/images/search").then((res) => res.json());
		message.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Meow")
					.setImage(url)
					.setColor(message.author.color),
			],
		});
	},
};