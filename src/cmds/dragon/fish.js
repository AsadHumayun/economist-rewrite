"use strict";
import { MessageEmbed } from "discord.js";
import delay from "delay";

export default {
	name: "fish",
	aliases: ["cast", "fish"],
	description: "Allows you to go fishing!\nCosts :dollar: 50",
	cst: "fishrod",
	async run(client, message) {
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
		message.reply({ embeds: [ new MessageEmbed().setDescription(`${message.author.tag} locates their ${client.const.emoji.fishing_rod} and goes fishing...`).setColor(message.author.color) ] });
		await delay(2000);
		const Fish = Math.floor(Math.random() * fishes.length);
		const fish = fishes[Fish];
		const amtGained = Math.floor(Math.random() * 250 / 5);
		let dollarsEarned = Math.round(amtGained / 5) * 10;
		const indx = client.const.shopItems.map(({ items }) => items.find(({ EMOJI }) => EMOJI === fish)).filter(f => typeof f != "undefined")[0].INDX;
		const drgs = message.author.data.get("drgs")?.split(";").map(Number) || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		if (!drgs[indx]) {
			drgs[indx] = amtGained;
		}
		else {
			drgs[indx] += amtGained;
		}
		await client.utils.updateBalance(message.author, dollarsEarned, message, { a: `fish-get-${fishes[Fish]}-${amtGained}` });
		await client.db.USERS.update({
			drgs: client.utils.removeZeros(drgs).join(";"),
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