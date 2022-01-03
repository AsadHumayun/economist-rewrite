"use strict";
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "feed",
	aliases: ["f", "feed"],
	description: "Feed your dragon and do *stuff*...",
	category: "pet",
	cst: "dragon",
	async run(client, message, args) {
		const cst = message.author.data.get("cst") ? message.author.data.get("cst").split(";") : [];
		let pet = message.author.data.get("pet");
		if (cst.includes("maxdragon888")) pet = client.config.statics.defaults.naxDragon;
		pet = pet.split(";");

		const cooldown = message.author.data.get("fdc");
		if (cooldown && (!cst.includes("maxdragon888"))) {
			const data = client.config.cooldown(message.createdTimestamp, cooldown * 60_000);
			if (data) {
				return message.reply(`Your dragon is convulsing its wings in annoyance; you should try again in ${data}`);
			}
		}
		const alias = await client.config.getDragonAlias(message.author.id, client);
		const input = (args[0] || "").toLowerCase();
		const foods = client.config.statics.defaults.foods;
		const type = foods[Object.keys(foods).find((x) => input.startsWith(x))];
		if (!type || (!args.length)) return message.reply(`The different types of food are ${client.config.list(Object.values(foods).map((x) => x.name))}`);
		if (!cst.includes("maxdragon888")) {
			const health = Number(pet[1]);
			const en = Number(pet[2]);
			pet[1] = health + type.gives.hp > 100 ? 100 : health + type.gives.hp;
			pet[2] = en + type.gives.en > 100 ? 100 : en + type.gives.en;
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
					pet: pet.join(";"),
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
					fdc: client.config.parseCd(message.createdTimestamp, time),
				}, {
					where: {
						id: message.author.id,
					},
				});
			}
		}
	},
};