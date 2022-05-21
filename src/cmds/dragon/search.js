"use strict";

import { MessageEmbed } from "discord.js";
import delay from "delay";

export default {
	name: "search",
	aliases: ["search", "srch"],
	description: "Lets your dragon go out in search of prey, consuming a certain amount of energy but gaining a certain amount of experience, depending on your dragon's stats",
	cst: "dragon",
	async run(client, message) {
		const alias = await client.utils.getDragonAlias(message.author.id);
		const cd = message.author.data.get("srchc") || 0;
		const scnd = client.utils.cooldown(message.createdTimestamp, cd * 60_000);
		if (scnd) {
			return message.reply(`Please wait another ${scnd} before searching again!`);
		}
		let data = message.author.data.get("drgn");
		if (message.author.data.get("cst")?.includes("maxdragon888")) data = client.const.naxDragon;
		if (!data) data = client.const.dragon;
		data = data.split(";").map(client.utils.expand);
		const en = data[2];
		const endur = data[6];
		const lvl = data[0];
		let xp = data[3];
		const str = data[7];
		const intel = data[5];
		const consumed = BigInt(Math.round(String(60n / BigInt(Math.round(Math.log(Number(endur) + 9))))));
		if (en - consumed < 0n) {
			return message.reply("🥱 I'm too tired to go searching right now! Why not feed me by using `" + message.guild ? message.guild.prefix : client.const.prefix + "feed`?");
		}
		const fishes = client.const.shopItems[1].items;
		const drgs = message.author.data.get("drgs")?.split(";").map(client.utils.expand) || new Array(20).fill(0n);
		const __fishIndex = Math.floor(Math.random() * fishes.length);
		const fish = fishes[__fishIndex];
		const amtGained = BigInt(Math.floor(Math.random() * 250 / 5)) * str;
		drgs[__fishIndex] += BigInt(amtGained);
		const xpGained = intel * 2n * 50n * lvl;
		data[2] = en - consumed;
		await client.db.USERS.update({
			drgs: client.utils.removeZeros(drgs).join(";"),
			// set cooldown for 20s.
			srchc: client.utils.parseCd(message.createdTimestamp, 20_000, true),
		}, {
			where: {
				id: message.author.id,
			},
		});
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag}'s ${alias[0]} elevates its wings in preparation to fly, consuming ${alias[1][1]} ${consumed}`),
			],
		});
		await delay(1500);
		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag}'s ${alias[0]} has discovered a lake and perched by it`),
			],
		});
		await delay(1500);
		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag}'s ${alias[0]} has found out that ${fish.EMOJI} ${client.utils.noExponents(amtGained)} are dwelling in the lake`),
			],
		});
		await delay(1500);
		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag}'s ${alias[0]} instantaneously lets out a mighty roar, <a:ecn_fire:804378228336361476> searing ${fish.EMOJI} ${client.utils.noExponents(amtGained)} and obtained ${alias[1][2]} ${client.utils.noExponents(xpGained) || "0"} in the process`),
			],
		});
		data[3] = xp + xpGained;
		if (!message.author.data.get("cst")?.split(";").includes("maxdragon888")) {
			xp = data[3];
			let levelups = 0n;
			let loops = 0n;

			if (lvl >= 50n) return;
			client.const.reqs.forEach(async (req) => {
				if (xp - req <= 0n) {
					levelups = loops + 1n - lvl;
				}
				else {
					loops += 1n;
				}
			});
			data[0] += levelups;
			data[4] += levelups;
			if (levelups > 0n) {
				message.reply({
					embeds: [
						new MessageEmbed()
							.setColor(message.author.color)
							.setDescription(`${message.author.tag}'s ${alias[0]} has levelled up ${client.utils.comma(levelups)} times and gained ${alias[1][3]} ${client.utils.comma(levelups)}!`),
					],
				});
			}
			await client.db.USERS.update({
				drgn: data.map(client.utils.format).join(";"),
			}, {
				where: {
					id: message.author.id,
				},
			});
		}
	},
};