"use strict";
import { MessageEmbed } from "discord.js";
import ms from "ms";

export default {
	name: "dose",
	aliases: ["dose", "consume"],
	description: "dose on something",
	async run(client, message, args) {
		const dose = (args[0] || "").toLowerCase();
		const res = client.utils.doses.findIndex((d) => dose.startsWith(d[0].split(";")[0]));
		if (res < 0) return message.reply(`The different types of consumables are: ${client.utils.list(client.utils.doses.map((d) => d[0].split(";")[1]))}`);
		const active = message.author.data.get(`dose${res}`) || 0;
		if ((message.createdTimestamp / 60_000) < active) return message.reply(`Your ${client.utils.doses[res][0].split(";")[5]} is active for another ${client.utils.cooldown(message.createdTimestamp, active * 60_000)} after your last dose.`);
		const lastUsed = message.author.data.get(client.utils.doses[res][0].split(";")[3]);
		if (lastUsed) {
			const time = client.utils.cooldown(message.createdTimestamp, lastUsed * 60_000);
			if (time) {
				return message.reply(`You must wait ${time} before consuming another ${client.utils.doses[res][0].split(";")[5]}`);
			}
		}
		const scs = await client.utils.doses[res][1](message, MessageEmbed);
		if (!scs) {
			await client.db.USERS.update({
				[`dose${res}`]: client.utils.parseCd(message.createdTimestamp, ms(client.utils.doses[res][0].split(";")[2])),
				[client.utils.doses[res][0].split(";")[3]]: client.utils.parseCd(message.createdTimestamp, ms(client.utils.doses[res][0].split(";")[4])),
			}, {
				where: {
					id: message.author.id,
				},
			});
		}
	},
};