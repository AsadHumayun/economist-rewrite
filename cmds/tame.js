"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "tame",
	aliases: ["tame", "getdragon"],
	category: "pet",
	description: "tame a dragon! (`~dragon`)",
	async run(client, message) {
		const cst = message.author.data.get("cst") ? message.author.data.get("cst").split(";") : [];
		if (cst.includes("dragon")) return message.reply("You already seem to own a dragon!");
		cst.push("dragon");
		await client.db.USERS.update({
			cst: cst.join(";"),
		}, {
			where: {
				id: message.author.id,
			},
		});
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has successfully tameed a :dragon_face: dragon! | \`${message.guild.prefix}dragon\``),
			],
		});
	},
};