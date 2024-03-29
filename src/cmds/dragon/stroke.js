"use strict";
import { MessageEmbed } from "discord.js";
import ms from "ms";

export default {
	name: "stroke",
	aliases: ["stroke", "str"],
	description: "Stroke your pet and increase its Affection by 1",
	cst: "dragon",
	async run(client, message) {
		const cooldown = message.author.data.get("strc") || 0;
		const cd = client.utils.cooldown(message.createdTimestamp, cooldown * 60_000);
		const pet = message.author.data.get("drgn").split(";").map(client.utils.expand);
		if (!pet)	return message.reply("It looks like you don't own a dragon! Why not tame one by using `" + message.guild?.prefix || "~" + "tame`");
		const alias = await client.utils.getDragonAlias(message.author.id);
		if (cd) return message.reply(`You must wait another ${cd} before stroking your ${alias[0]} again!`);
		pet[8] += 1n;
		if (!message.author.data.get("cst")?.split(";").includes("maxdragon888")) await client.db.USERS.update({ drgn: pet.map(client.utils.format).join(";"), strc: client.utils.parseCd(message.createdTimestamp, ms("3h"))	}, { where: { id: message.author.id } });
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${alias[1][7]} ${message.author.tag} has stroked their ${alias[0]}`),
			],
		});
	},
};