"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "dose",
	aliases: ["dose", "consume"],
	description: "dose on something",
	usage: "<drug: string>",
	async run(client, message, args) {
		const names = (client.const.shopItems.map(({ items }) => items.map(({ DISPLAY_NAME }) => DISPLAY_NAME).join(";")).join(";")).split(";");
		if (!names.find(e => e.startsWith(client.utils.rossCaps(args.join(" "))))) return message.reply("You must provide a valid ID of what you would like to purchase (the ID of an item is the number in brackets next to that item in the shop) in order for this command to work!");
		const item = client.const.shopItems.map(({ items }) => items.find(({ DISPLAY_NAME }) => DISPLAY_NAME.startsWith(client.utils.rossCaps(args.join(" "))))).filter(f => typeof f != "undefined")[0];
		if (item.CST || !item.CDK) return message.reply("You cannot consume that item");
		const drgs = message.author.data.get("drgs")?.split(";").map(BigInt) || [];
		if (!drgs[item.INDX] || drgs[item.INDX] - 1n < 0n) return message.reply(`You don't have ${item.EMOJI} 1`);
		const dose = message.author.data.get(`dose${item.INDX}`);
		if (Math.floor(message.createdTimestamp / 60_000) < dose) return message.reply(`Your ${item.EMOJI} is still active for another ${client.utils.cooldown(message.createdTimestamp, dose * 60_000)}!`);
		const lastUsed = message.author.data.get(item.CDK);
		if (lastUsed) {
			const time = client.utils.cooldown(message.createdTimestamp, lastUsed * 60_000);
			if (time) {
				return message.reply(`You must wait ${time} before consuming another ${item.EMOJI}`);
			}
		}
		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has dosed on ${item.EMOJI}!`),
			],
		});
		try {
			drgs[item.INDX] -= 1n;
			await client.db.USERS.update({
				drgs: client.utils.removeZeros(drgs.map(String)).join(";"),
			}, {
				where: {
					id: message.author.id,
				},
			});
			item.executeUponDose(message.author, message.author.data, message);
		}
		catch (e) {
			return;
		}
	},
};