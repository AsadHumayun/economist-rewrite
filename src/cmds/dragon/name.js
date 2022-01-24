"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "name",
	aliases: ["name", "dragonname", "namedragon", "dragon-name", "name-dragon", "petname"],
	description: "Name your dragon.",
	cst: "supreme",
	async run(client, message, args) {
		if (!args.length) return message.reply("You must specify a new name for your dragon in order for this command to work!");
		const newName = args.join(" ").toString();
		if (newName.length > 128) return message.reply("Your dragon's name may not exceed 128 characters in length.");
		await client.db.USERS.update({
			petname: newName || null,
		}, {
			where: {
				id: message.author.id,
			},
		});
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has successfully updated their pet's name to "${newName || "dragon"}"`),
			],
		});
	},
};