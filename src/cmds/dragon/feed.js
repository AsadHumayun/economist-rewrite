"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "feed",
	aliases: ["f", "feed"],
	usage: "<food: string>",
	description: "Feed your dragon and do *stuff*...",
	cst: "dragon",
	disabled: true,
	// feed needs to be updated to the new shop system
	// A separate issue will be created.
	async run(client, message, args) {
		const cst = message.author.data.get("cst") ? message.author.data.get("cst").split(";") : [];
		let pet = message.author.data.get("drgn");
		if (cst.includes("maxdragon888")) pet = client.const.naxDragon;
		pet = pet.split(";");

		const cooldown = message.author.data.get("fdc") || 0;
		if (cooldown && (!cst.includes("maxdragon888"))) {
			const data = client.utils.cooldown(message.createdTimestamp, cooldown * 60_000);
			if (data) {
				return message.reply(`Your dragon is convulsing its wings in annoyance; you should try again in ${data}`);
			}
		}
		const alias = await client.utils.getDragonAlias(message.author.id);
		const input = (args[0] || "").toLowerCase();
		const foods = client.const.foods;
		const type = foods[Object.keys(foods).find((x) => input.startsWith(x))];
		if (!type || (!args.length)) return message.reply(`The different types of food are ${client.utils.list(Object.values(foods).map((x) => x.name))}`);
		if (!cst.includes("maxdragon888")) {
			const health = BigInt(pet[1]);
			const en = BigInt(pet[2]);
			pet[1] = health + type.gives.hp > 100n ? 100n : health + type.gives.hp;
			pet[2] = en + type.gives.en > 100n ? 100n : en + type.gives.en;
			if (type.key.split(";").length > 1 && (!cst.includes("allfood"))) {
				const fsh = (message.author.data.get("fsh") ? message.author.data.get("fsh").split(";") : []).map((v) => v ? Number(v) : 0);
				if (fsh[type.key.split(";")[1]] - 1 < 0) return message.reply("You don't have that type of food!");
				fsh[type.key.split(";")[1]] -= 1;
				await client.db.USERS.update({
					fsh: fsh.join(";"),
				}, {
					where: {
						id: message.author.id,
					},
				});
			}
			else if (!cst.includes("allfood")) {
				let amt = message.author.data.get(type.key);
				if (amt - 1 < 0) return message.reply("You don't have that type of food!");
				amt -= 1;
				await client.db.USERS.update({
					[type.key]: amt,
					drgn: pet.join(";"),
				}, {
					where: {
						id: message.author.id,
					},
				});
			}
		}
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has fed their ${alias[0]} a ${type.emoji}, and re-plenished ${alias[1][0]} ${type.gives.hp} and ${alias[1][1]} ${type.gives.en}!`),
			],
		});
		if (type.name == "chillpill" && (Math.floor(Math.random(1) * 10) >= 10)) {
			return message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`Because of being fed a ${type.emoji}, ${message.author.tag}'s ${alias[0]} is so chill, that it's decided to have absolutely no feed cooldown!`),
				],
			});
		}
		else {
			const cd = Math.floor(((30 / Number(pet[9])) * 0.75 + 5));
			let time = cd;
			time *= 60000;
			if (!cst.includes("maxdragon888")) {
				await client.db.USERS.update({
					fdc: client.utils.parseCd(message.createdTimestamp, time),
				}, {
					where: {
						id: message.author.id,
					},
				});
			}
		}
	},
};