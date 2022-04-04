"use strict";
import { MessageEmbed } from "discord.js";
import ms from "ms";

export default {
	name: "daily",
	aliases: ["daily"],
	description: "Adds :dollar: 5,000 to your account",
	async run(client, message) {
		const dlc = message.author.data.get("dlc");
		const cd = client.utils.cooldown(message.createdTimestamp, dlc * 60_000);
		if (cd) {
			message.reply(`You must wait ${cd} before collecting your daily reward!`);
		}
		else {
			const streak = message.author.data.get("dlstr")?.split(";").map(Number) || [0, 0];
			let amountAdded = 0;
			if (streak[1] !== 0 && (Math.trunc(message.createdTimestamp / 60_000) > streak[1])) {
				const days = Math.round(Math.trunc(message.createdTimestamp / 60000) - streak[1] / 1440);
				message.reply({ content: `Oh no! You forgot to claim your daily reward ${days} days ago and lost your streak! :weary:`, allowedMentions: { repliedUser: true } });
				amountAdded = client.const.dailyReward;
				await client.utils.updateBalance(message.author, amountAdded, message, { a: "daily-reward-streak-0(reset?: true)" });
				await client.db.USERS.update({
					dlc: client.utils.parseCd(message.createdTimestamp, ms("1d")),
					dlstr: `0;${Math.trunc(message.createdTimestamp / 60_000) + (1440 * 2)}`,
				}, {
					where: {
						id: message.author.id,
					},
				});
				streak[0] = 0;
			}
			else {
				// before, "streak" was split and mapped by the Number function again on this line.
				// This was shortly removed and replaced with a more performant alternative.
				streak[0]++;
				amountAdded = client.const.dailyReward * (streak[0] == 0 ? 1 : streak[0]);
				await client.utils.updateBalance(message.author, amountAdded, message, { a: `daily-reward-streak-${streak[0]}` });
				// increment streak
				await client.db.USERS.update({
					dlc: client.utils.parseCd(message.createdTimestamp, ms("1d")),
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
						.setFooter(`Streak: ${streak[0]} days`)
						.setDescription(`${message.author.tag} has collected their daily reward and received :dollar: ${client.utils.digits(amountAdded.toString())} in cash`),
				],
			});
		}
	},
};