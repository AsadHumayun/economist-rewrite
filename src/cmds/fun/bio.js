"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "bio",
	aliases: ["bio", "setbio"],
	description: "Edits your `bio` (Shwon in the `profile` command)",
	usage: "<bio: ?string>",
	async run(client, message, args) {
		let str = args.join(" ") || "";
		// bio is of type Sequelize.STRING
		await client.db.USERS.update({
			bio: str,
		}, {
			where: {
				id: message.author.id,
			},
		});
		str = str.slice(0, 255);
		if (str.length >= 1) {
			message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag} has updated their profile bio!`),
				] });
		}
		else {
			message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag} has removed their bio!`),
				],
			});
		}
	},
};