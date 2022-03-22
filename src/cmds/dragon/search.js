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
		const scnd = client.utils.cooldown(message.createdTimestamp, cd * 60_000n);
		if (scnd) {
			return message.reply(`Please wait another ${scnd} before searching again!`);
		}
		let data = message.author.data.get("drgn");
		if (message.author.data.get("cst")?.includes("maxdragon888")) data = client.const.naxDragon;
		if (!data) data = client.const.dragon;
		data = data.split(";").map(BigInt);
		const en = data[2];
		const endur = data[6];
		const lvl = data[0];
		let xp = data[3];
		const str = data[7];
		const intel = data[5];
		const consumed = Math.round((60n / BigInt(Math.log(endur + 9))));
		if (en - consumed < 0n) {
			return message.reply("🥱 I'm too tired to go searching right now! Why not feed me by using `" + message.guild ? message.guild.prefix : client.const.prefix + "feed`?");
		}
		// parseFloat(((message.createdTimestamp + ms("20s"))/60_000)).toFixed(2)
		const f = (message.author.data.get("fsh") || "0;0;0;0;0;0").split(";").map(BigInt);
		const fishes = [":dolphin:", ":shark:", ":blowfish:", ":tropical_fish:", ":fish:"];
		const Fish = Math.floor(Math.random() * fishes.length);
		const fish = fishes[Fish];
		const amtGained = Math.floor(Math.random() * 250 / 5) * str;
		f[Fish] += amtGained;
		const xpGained = BigInt(Math.floor(BigInt(intel) * 2n * 50n * BigInt(0.5)) * lvl);
		data[2] = en - consumed;
		await client.db.USERS.update({
			fsh: f.join(";"),
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
					.setDescription(`${message.author.tag}'s ${alias[0]} has found out that ${fish} ${client.utils.noExponents(amtGained)} are dwelling in the lake`),
			],
		});
		await delay(1500);
		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag}'s ${alias[0]} instantaneously lets out a mighty roar, <a:ecn_fire:804378228336361476> searing ${fish} ${client.utils.noExponents(amtGained)} and obtained ${alias[1][2]} ${client.utils.noExponents(xpGained) || "0"} in the process`),
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
				drgn: data.map(String).join(";"),
			}, {
				where: {
					id: message.author.id,
				},
			});
		}
	},
};