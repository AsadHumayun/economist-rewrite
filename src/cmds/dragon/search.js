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
		const cd = message.author.data.get("srchc");
		const scnd = client.utils.cooldown(message.createdTimestamp, cd * 60_000);
		if (scnd) {
			return message.reply(`Please wait another ${scnd} before searching again!`);
		}
		let data = message.author.data.get("drgn").split(";").map(Number);
		if (message.author.data.get("cst")?.includes("maxdragon888")) data = client.const.naxDragon.split(";");
		if (!data) data = client.const.dragon;
		const en = data[2];
		const endur = data[6];
		const lvl = data[0];
		let xp = data[3];
		const str = data[7];
		const intel = data[5];
		const consumed = Math.round((60 / (Math.log(endur + 9))));
		if (en - consumed < 0) {
			return message.reply("🥱 I'm too tired to go searching right now! Why not feed me by using `" + message.guild ? message.guild.prefix : client.const.prefix + "feed`?");
		}
		// parseFloat(((message.createdTimestamp + ms("20s"))/60_000)).toFixed(2)
		const f = (message.author.data.get("fsh") || "0;0;0;0;0;0").split(";").map(Number);
		const fishes = [":dolphin:", ":shark:", ":blowfish:", ":tropical_fish:", ":fish:"];
		const Fish = Math.floor(Math.random() * fishes.length);
		const fish = fishes[Fish];
		const amtGained = Math.floor(Math.random() * 250 / 5) * str;
		f[Fish] += amtGained;
		const xpGained = Math.floor(intel * 2 * 50 * 0.5) * lvl;
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
			let levelups = 0;
			let loops = 0;

			if (lvl >= 50) return;
			client.const.reqs.forEach(async (req) => {
				if (xp - req <= 0) {
					levelups = loops + 1 - lvl;
				}
				else {
					loops += 1;
				}
			});
			data[0] += levelups;
			data[4] += levelups;
			if (levelups > 0) {
				message.reply({
					embeds: [
						new MessageEmbed()
							.setColor(message.author.color)
							.setDescription(`${message.author.tag}'s ${alias[0]} has levelled up ${levelups} times and gained ${alias[1][3]} ${levelups}!`),
					],
				});
			}
			await client.db.USERS.update({
				drgn: data.join(";"),
			}, {
				where: {
					id: message.author.id,
				},
			});
		}
	},
};