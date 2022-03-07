"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "defend",
	aliases: [ "protect", "defend" ],
	description: "Toggle your dragon's protection — whether or not it will defend you when someone attempts to attack you.",
	async run(client, message) {
		// "args" weren't passed through here because they're not used, means memory isn't wasted on that var, makking this more efficient.
		let cst = message.author.data.get("cst") ? message.author.data.get("cst").split(";") : [];
		if (!cst.includes("dragon")) return message.reply("You must have a dragon in order for it to defend you! tame one by using `" + message.guild ? message.guild.prefix : client.const.prefix + "tame`");
		const dragonAlias = await client.utils.getDragonAlias(message.author.id);
		const p = message.author.data.get("drgn").split(";").map(Number);
		if (p[1] < 200) return message.reply("Your " + dragonAlias[0] + " must have at least " + dragonAlias[1][0] + " 200 in order to defend you from attackers.");
		if (!cst.includes("dfnd")) {
			cst.push("dfnd");
			message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag}'s ${cst.includes("maxdragon888") ? "entirely maxed out" : ""} ${dragonAlias[0]} will now defend them from attackers.`),
				],
			});
		}
		else {
			cst = cst.filter((x) => !["dfnd"].includes(x));
			message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag}'s ${cst.includes("maxdragon888") ? "entirely maxed out" : ""} ${dragonAlias[0]} will no longer defend them from attackers.`),
				],
			});
		}
		await client.db.USERS.update({
			cst: cst.join(";"),
		}, {
			where: {
				id: message.author.id,
			},
		});
	},
};