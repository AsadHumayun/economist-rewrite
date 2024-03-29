"use strict";
import { MessageEmbed } from "discord.js";
import ms from "ms";

export default {
	name: "deprive",
	aliases: ["deprive"],
	usage: "<stat: string>",
	description: "Completely deprive your pet's credits on a stat, reducing it to 1 and receive the appropriate amount of credits in return; 2h cooldown",
	cst: "supreme",
	async run(client, message, args) {
		const cd = message.author.data.get("dpc") || 0;
		if (cd) {
			const data = client.utils.cooldown(message.createdTimestamp, cd * 60_000);
			if (data) {
				return message.reply(`You must wait ${data} before depriving another stat!`);
			}
		}
		const cst = message.author.data.get("cst")?.split(";") || [];
		if (!cst.includes("dragon")) return message.reply("You do not have a pet dragon!");
		let pet = message.author.data.get("drgn");
		if (cst.includes("maxdragon888")) pet = client.const.naxDragon;
		const alias = await client.utils.getDragonAlias(message.author.id);
		pet = pet.split(";").map(client.utils.expand);
		const stat = (args[0] || "").toLowerCase();
		let Stat = client.const.upgr.find((x) => stat.startsWith(x.split(";")[0]));
		if (!Stat) return message.reply(`The different types of stats are: ${client.utils.list(client.const.upgr.map((x) => x.split(";")[1]))}`);
		Stat = Stat.split(";");
		const Credits = pet[Stat[2]];
		const amt = Credits - 1n;
		if (amt < 0) {
			return message.reply("You must have at least 2 credits on a specified `<stat>` before depriving your dragon of said stat.");
		}
		pet[Stat[2]] = Credits - amt;
		pet[4] += amt;
		// shouldn't affect users with the maxdragon -- the maxdragon is intended to be a "ghost" type thing; it doesn't change no matter what the user does.
		if (!cst.includes("maxdragon888")) {
			await client.db.USERS.update({
				dpc: client.utils.parseCd(message.createdTimestamp, ms("6h")),
				drgn: pet.map(client.utils.format).join(";"),
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
					.setDescription(`${message.author.tag} has deprived their ${alias[0]}'s ${Stat[1]} by ${client.utils.digits(amt)} points but received ${alias[1][3]} ${client.utils.digits(amt)} credits in the process!`),
			],
		});
	},
};