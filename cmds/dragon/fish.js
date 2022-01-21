"use strict";
import { MessageEmbed } from "discord.js";
import delay from "delay";

export default {
	name: "fish",
	aliases: ["cast", "fish"],
	description: "Allows you to go fishing!\nCosts :dollar: 50",
	cst: "fishrod",
	cstMessage: "You need a {client.const.emoji.fishing_rod} in order to go fishing! `{message.guild ? message.guild.prefix : client.const.prefix}shop`",
	async run(client, message) {
		const cst = message.author.data.get("cst") ? message.author.data.get("cst").split(";") : [];
		if (!cst.includes("fishrod")) return message.reply();

		const cd = message.author.data.get("fishc") || 0;
		const scnd = client.utils.cooldown(message.createdTimestamp, cd * 60_000);
		if (scnd) {
			return message.reply(`Please wait another ${scnd} before fishing, otherwise your rod will break!`);
		}
		await client.db.USERS.update({
			fishc: client.utils.parseCd(message.createdTimestamp, 20_000, true),
		}, {
			where: {
				id: message.author.id,
			},
		});
		const fishes = [
			":dolphin:",
			":shark:",
			":blowfish:",
			":tropical_fish:",
			":fish:",
		];
		const bal = message.author.data.get("bal") || 0;
		message.reply({ embeds: [ new MessageEmbed().setDescription(`${message.author.tag} locates their ${client.const.emoji.fishing_rod} and goes fishing...`).setColor(message.author.color) ] });
		await delay(2000);
		const Fish = Math.floor(Math.random() * fishes.length);
		const fish = fishes[Fish];
		const amtGained = Math.floor(Math.random() * 250 / 5);
		let dollarsEarned = Math.round(amtGained / 5) * 10;
		// todo: merge fsh into an itms key or something similar.
		const f = (message.author.data.get("fsh") || "0;0;0;0;0;0;0;0").split(";").map(Number);
		f[Fish] = Number(f[Fish]) + amtGained;
		await client.db.USERS.update({
			bal: bal + dollarsEarned,
			fsh: f.join(";"),
		}, {
			where: {
				id: message.author.id,
			},
		});
		if (fishes[fish] == ":dolphin:") dollarsEarned = (dollarsEarned * 2) * amtGained;
		if (fishes[fish] == ":shark:") dollarsEarned = (dollarsEarned / 2) * amtGained;
		if (fishes[fish] == ":blowfish:") dollarsEarned = 0;
		if (fishes[fish] == ":tropical_fish:") dollarsEarned = (dollarsEarned * 3) * amtGained;
		if (fishes[fish] == ":fish:") dollarsEarned = 10 * amtGained;
		message.channel.send({ embeds: [ new MessageEmbed().setDescription(`${message.author.tag} sits down near a calm pool of water... :droplet:`).setColor(message.author.color) ] });
		await delay(2000);
		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has found a school of ${fish}...`),
			],
		});
		await delay(2000);
		if (fishes[fish] != ":blowfish:") {
			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag} has caught ${fish} ${amtGained} and earnt :dollar: ${dollarsEarned}`),
				],
			});
		}
		else {
			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`Due to the blowfish having spikes, ${message.author.tag} is unable to catch enough of them and ends up wasting their time :(`),
				],
			});
		}
	},
};