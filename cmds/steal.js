"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "steal",
	description: "steal a briefcase",
	category: "eco",
	aliases: ["steal"],
	async run(client, message) {
		const channel = await client.db.CHNL.findOne({ where: { id: message.channel.id } });
		if (!channel.get("pkg")) return message.reply("There are no briefcases to steal right now :c");
		await client.db.CHNL.update({
			pkg: null,
		}, {
			where: {
				id: message.channel.id,
			},
		});
		const amt = Math.floor(Math.random() * 1000);
		await client.db.USERS.update({
			bal: message.author.data.get("bal") + amt,
		}, {
			where: {
				id: message.author.id,
			},
		});
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has stolen ${client.users.cache.filter((x) => x.id != message.author.id && !x.bot).random().tag}'s briefcase and found :dollar: ${client.config.comma(amt)}`),
			],
		});
	},
};