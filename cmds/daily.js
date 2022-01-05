"use strict";
import { MessageEmbed } from "discord.js";
import ms from "ms";

export default {
	name: "daily",
	aliases: ["daily"],
	category: "ecn",
	description: "Adds :dollar: 5,000 to your account",
	async run(client, message) {
		const dlc = message.author.data.get("dlc");
		const cd = client.config.cooldown(message.createdTimestamp, dlc * 60_000);
		if (cd) {
			message.reply(`You must wait ${cd} before collecting your daily reward!`);
		}
		else {
			let streak = message.author.data.get("dlstr");
			let amountAdded = 0;
			if (streak && (Math.trunc(message.createdTimestamp / 60_000) > streak.split(";").map(Number)[1])) {
				streak = streak.split(";").map(Number);
				const days = Math.trunc(message.createdTimestamp / 60_000) - streak[1];
				message.reply({ content: `Oh no! You forgot to claim your daily reward ${days} days ago and lost your streak! :weary:`, allowedMentions: { repliedUser: true } });
				amountAdded = client.config.statics.defaults.dailyReward;
				await client.db.USERS.update({
					bal: message.author.data.get("bal") + amountAdded,
					dlc: client.config.parseCd(message.createdTimestamp, ms("1d")),
					dlstr: `0;${Math.trunc(message.createdTimestamp / 60_000) + (1440 * 2)}`,
				}, {
					where: {
						id: message.author.id,
					},
				});
				streak[0] = 0;
			}
			else {
				streak = streak ? streak.split(";").map(Number) : [0, 0];
				amountAdded = 0.5 * client.config.statics.dailyReward * (streak[0] == 0 || isNaN(streak[0]) ? 1 : streak[0]);
				// increment streak
				streak[0]++;
				await client.db.USERS.update({
					bal: message.author.data.get("bal") + amountAdded,
					dlc: client.config.parseCd(message.createdTimestamp, ms("1d")),
					dlstr: `${streak[0]};${Math.trunc(message.createdTimestamp / 60_000) + (1440 * 2)}`,
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
						.setFooter(`Streak: ${streak[0] || "0"} days`)
						.setDescription(`${message.author.tag} has collected their daily reward and received :dollar: ${client.config.comma(amountAdded)} in cash`),
				],
			});
		}
	},
};