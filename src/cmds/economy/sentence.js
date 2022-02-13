"use strict";
import { MessageEmbed } from "discord.js";
import delay from "delay";

export default {
	_msgSendDelay: 1000,
	name: "sentence",
	aliases: ["sentence", "sente"],
	cst: "judge",
	usage: "<user: UserResolvable>",
	description: "judge a user, stunning them in a range of 4-10 minutes.",
	async run(client, message, args) {
		const coold = message.author.data.get("sntc");
		if (coold) {
			const data = client.utils.cooldown(message.createdTimestamp, coold * 60_000);
			if (data) {
				return message.reply(`You must wait ${data} before you can sentence again!`);
			}
		}
		if (!args.length) return message.reply("You must mention your target in order for this command to work!");
		const user = await client.utils.fetchUser(args[0]).catch(() => {return;});
		if (!user) return message.reply({ content: `Invalid user "${args[0]}"`, allowedMentions: { parse: [] } });
		const data = await client.db.getUserData(user.id);
		await client.db.USERS.update({
			// 21600000ms = 6h
			sntc: client.utils.parseCd(message.createdTimestamp, 21600000),
		}, {
			where: {
				id: message.author.id,
			},
		});
		const didntWork = Math.floor(Math.random() * 100);

		const bal = data.get("bal") || 0;
		let amtLost = Math.floor(bal / 5);
		if (bal - amtLost < 0) amtLost = bal;
		//		await client.utils.dm()
		await client.utils.dm({
			userId: user.id,
			message: {
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag} has summoned ${user.tag} in court`),
				],
			},
			channel: message.channel,
		});
		await delay(this._msgSendDelay);
		await client.utils.dm({
			userId: user.id,
			message: {
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`It turns out ${user.tag} is a loser and ends up pissing on the floor, losing their dignity`),
				],
			},
			channel: message.channel,
		});
		await delay(this._msgSendDelay);

		if (didntWork > 90) {
			// 10% chance doesn't work, I believe.
			await client.utils.dm({
				userId: user.id,
				message: {
					embeds: [
						new MessageEmbed()
							.setColor(message.author.color)
							.setDescription(`${user.tag}'s lawyer was able to save ${user.tag}'s ass this time round!`),
					],
				},
				channel: message.channel,
			});
			await delay(this._msgSendDelay);

			await client.utils.dm({
				userId: user.id,
				message: {
					embeds: [
						new MessageEmbed()
							.setColor(message.author.color)
							.setDescription(`:slight_frown: ${message.author.tag} failed to sentence ${user.tag}`),
					],
				},
				channel: message.channel,
			});
			return;
		}
		else {
			let stunTime = Math.floor(Math.random() * 10) + 1;
			if (stunTime < 4) stunTime = 4;
			stunTime *= 60_000;
			//		stn: function (id, amt, client) {
			await client.utils.stn({
				userId: user.id,
				minutes: Math.trunc(stunTime / 60_000),
				stnb: "in jail",
			});
			await client.utils.dm({
				userId: user.id,
				message: {
					embeds: [
						new MessageEmbed()
							.setColor(message.author.color)
							.setDescription(`After careful consideration, it is decided that ${user.tag} is punishable as a result of their insane ugliness; ${message.author.tag} has won the court case`),
					],
				},
				channel: message.channel,
			});
			await delay(this._msgSendDelay);

			await client.utils.dm({
				userId: user.id,
				message: {
					embeds: [
						new MessageEmbed()
							.setColor(message.author.color)
							.setDescription(`:dollar: ${client.utils.comma(amtLost) || "0"} have been moved to ${message.author.tag}'s account since ${user.tag} was unable to win the court case lol`),
					],
				},
				channel: message.channel,
			});
			await client.db.USERS.update({
				bal: bal - amtLost,
			}, {
				where: {
					id: user.id,
				},
			});
			await client.db.USERS.update({
				bal: bal + amtLost,
			}, {
				where: {
					id: message.author.id,
				},
			});
			await client.utils.dm({
				userId: user.id,
				message: {
					embeds: [
						new MessageEmbed()
							.setColor(message.author.color)
							.setDescription(`${user.tag} has been put into jail for ${stunTime / 60_000} minutes`),
					],
				},
				channel: message.channel,
			});
		}
	},
};