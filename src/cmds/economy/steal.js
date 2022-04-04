"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "steal",
	description: "steal a briefcase",
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
		const amt = BigInt(Math.floor(Math.random() * 1000));
		await client.utils.updateBalance(message.author, amt, message, { a: `brfc-stl-${message.channel.id}` });
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has stolen ${client.users.cache.filter((x) => x.id != message.author.id && !x.bot).random().tag}'s briefcase and found :dollar: ${client.utils.digits(amt)}`),
			],
		});
	},
};