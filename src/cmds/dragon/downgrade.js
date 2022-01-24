"use strict";
import { MessageEmbed } from "discord.js";
import ms from "ms";

export default {
	name: "downgrade",
	aliases: ["downgrade", "decondition"],
	description: "downgrade one of your dragon's stat and receive one credit in return",
	cst: "dragon",
	async run(client, message, args) {
		const cd = message.author.data.get("dgrc") || 0;
		let data = client.utils.cooldown(message.createdTimestamp, cd * 60_000);
		if (data) {
			return message.reply(`You must wait another ${data} before downgrading another one of your dragon's stat!`);
		}
		data = message.author.data.get("drgn");
		const cst = message.author.data.get("cst") ? message.author.data.get("cst").split(";") : [];
		if (cst.includes("maxdragon888")) data = client.const.maxDragon;
		data = data.split(";");
		const stat = (args[0] || "").toLowerCase();
		let Stat = client.utils.upgr.find((x) => stat.startsWith(x.split(";")[0]));
		if (!Stat) return message.reply(`The different types of stats are: ${client.utils.list(client.utils.upgr.map((x) => x.split(";")[1]))}`);
		Stat = Stat.split(";");
		const alias = await client.utils.getDragonAlias(message.author.id, client);
		data[4] = Number(data[4]) + 1;
		data[Stat[2]] = Number(data[Stat[2]]) - 1;
		if (data[Stat[2]] <= 1) return message.reply(`Each of your ${alias[0]}'s stats must have at least 1 point.`);
		if (!cst.includes("maxdragon888")) {
			await client.db.USERS.update({
				dgrc: client.utils.parseCd(message.createdTimestamp, ms("30m")),
				pet: data.join(";"),
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
					.setDescription(`${message.author.tag} has reduced their ${alias[0]}'s ${Stat[1]} and received ${alias[1][3]} 1!`),
			],
		});
	},
};