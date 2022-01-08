"use strict";
import { MessageEmbed } from "discord.js";
import ms from "ms";

export default {
	name: "deprive",
	aliases: ["deprive"],
	description: "Completely deprive your pet's credits on a stat, reducing it to 1 and receive the appropriate amount of credits in return; 2h cooldown",
	cst: "supreme",
	category: "pet",
	async run(client, message, args) {
		const cd = message.author.data.get("dpc") || 0;
		if (cd) {
			const data = client.utils.cooldown(message.createdTimestamp, cd * 60_000);
			if (data) {
				return message.reply(`You must wait ${data} before depriving another stat!`);
			}
		}
		const cst = message.author.data.get("cst") ? message.author.data.get("cst").split(";") : [];
		if (!cst.includes("dragon")) return message.reply("You do not have a pet dragon!");
		let pet = message.author.data.get("pet");
		if (cst.includes("maxdragon888")) pet = client.const.naxDragon;
		const alias = await client.utils.getDragonAlias(message.author.id, client);
		pet = pet.split(";");
		const stat = (args[0] || "").toLowerCase();
		let Stat = client.utils.upgr.find((x) => stat.startsWith(x.split(";")[0]));
		if (!Stat) return message.reply(`The different types of stats are: ${client.utils.list(client.utils.upgr.map((x) => x.split(";")[1]))}`);
		Stat = Stat.split(";");
		const Credits = Number(pet[Stat[2]]);
		const amt = Credits - 1;
		if (amt < 0) {
			return message.reply("You must have at least 2 credits on a specified `<stat>` before depriving your dragon of said stat.");
		}
		pet[Stat[2]] = Credits - amt;
		pet[4] = Number(pet[4]) + amt;
		// shouldn't affect users with the maxdragon -- the maxdragon is intended to be a "ghost" type thing; it doesn't change no matter what the user does.
		if (!cst.includes("maxdragon888")) {
			await client.db.USERS.update({
				dpc: client.utils.parseCd(message.createdTimestamp, ms("6h")),
				pet: pet.join(";"),
			}, {
				where: {
					id: message.author.id,
				},
			});
		}
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has deprived their ${alias[0]}'s ${Stat[1]} by ${amt} points and received ${alias[1][3]} ${amt} credits!`),
			],
		});
	},
};