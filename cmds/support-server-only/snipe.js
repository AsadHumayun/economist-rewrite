"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "snipe",
	aliases: ["snipe", "sn"],
	description: "View the last deleted message in the current channel",
	ssOnly: true,
	cst: "snipe",
	async run(client, message) {
		const channel = await client.db.CHNL.findOne({ where: { id: message.channel.id } });
		const data = channel.get("snipe");
		if (!data) return message.reply("Nothing to snipe here!");
		const snipeMsg = Buffer.from(data.split(";")[1], "base64").toString("ascii");
		const user = await client.users.fetch(data.split(";")[0]);
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setTitle("Sniped Message")
					.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
					.setDescription(snipeMsg),
			],
		});
	},
};