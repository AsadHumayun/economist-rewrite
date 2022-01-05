"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "balance",
	category: "ecn",
	aliases: ["balance", "bal", "money"],
	description: "Check someone's balance, see how much money they have",
	usage: "<User(id | @Mention)>",
	async run(client, message, args) {
		let usr = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!usr) usr = message.author;
		const data = await client.db.getUserData(usr.id);
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${usr.tag}'s account contains :dollar: ${client.config.digits(data.get("bal") || "0")}`),
			],
		});
	},
};