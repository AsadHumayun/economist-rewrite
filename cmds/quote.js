"use strict";
/* eslint-disable prefer-const */
import { MessageEmbed } from "discord.js";

export default {
	name: "quote",
	aliases: ["quote"],
	description: "Shows you a random quote from your collection",
	cst: "qts",
	async run(client, message) {
		if (!message.author.data.get("qts")) return message.reply(`You currently don't have any quotes! \`${message.guild.prefix}addquote <quote>\` to add one!`);
		const pq = Number(message.author.data.get("pq")) || -1;
		let qIndex;
		const qts = message.author.data.get("qts").split(";");
		// answers[~~(Math.random() * answers.length)]
		let rand = Math.floor(Math.random() * qts.length);
		if (rand == pq) {
			console.log("Pq and rand are the same.");
			do {
				rand = Math.floor(Math.random() * qts.length);
				console.log(`Changed qIndex to ${rand}.\nquote: ${qts[rand]}`);
			} while (rand == pq);
		}
		qIndex = rand;
		if (qts.length == 1) qIndex = 1;
		await client.db.USERS.update({
			pq: qIndex,
		}, {
			where: {
				id: message.author.id,
			},
		});
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(qts[qIndex]),
			],
		});
	},
};