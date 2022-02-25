"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "buy",
	aliases: ["buy", "purchase"],
	description: "Buy something from the overpriced shop",
	usage: "<item index: number>",
	async run(client, message, args) {
		const ids = (client.const.shopItems.map(({ items }) => items.map(({ ID }) => ID).join(";")).join(";")).split(";");
		if (!ids.includes(args[0])) return message.reply("You must provide a valid ID of what you would like to purchase (the ID of an item is the number in brackets next to that item) in order for this command to work!");
		const item = client.const.shopItems.map(({ items }) => items.find(({ ID }) => ID == args[0])).filter(f => typeof f != "undefined")[0];
		const bal = Number(message.author.data.get("bal") || 0);
		// now that we've isolated the item the user wants to purchase, we can add it to them depeneding on its type
		// eg if it's a cst, it'll be set differently etc
		if (item.CST) {
			const cst = message.author.data.get("cst")?.split(";") || [];
			if (cst.includes(item.CST)) return message.reply(`It seems that you already own ${item.EMOJI} ${item.DISPLAY_NAME}!`);
			if (bal - item.PRICE < 0) return message.reply(`Your balance of :dollar: ${client.utils.comma(bal)} is insufficient to complete this transaction`);
			cst.push(item.CST);
			await client.db.USERS.update({
				bal: bal - item.PRICE,
				cst: cst.join(";"),
			}, {
				where: {
					id: message.author.id,
				},
			});

			message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag} has successfully purchased a ${item.EMOJI} ${item.DISPLAY_NAME} for :dollar: ${client.utils.comma(item.PRICE)}!`),
				],
			});
		}
		else {
			// user is purchasing a collectable item
			// stored in drgs key
			const drgs = message.author.data.get("drgs")?.split(";").map(Number) || [];
			const amt = isNaN(args[1]) || Number(args[1]) <= 0 ? 1 : Number(args[1]);
			if (bal - (item.PRICE * amt) < 0) return message.reply(`Your balance of :dollar: ${client.utils.comma(bal)} is insufficient to complete this transaction`);
			if (!drgs[item.INDX]) drgs[item.INDX] = 0;
			drgs[item.INDX] += amt;
			await client.db.USERS.update({
				bal: bal - (item.PRICE * amt),
				drgs: client.utils.removeZeros(drgs).join(";"),
			}, {
				where: {
					id: message.author.id,
				},
			});

			message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag} has successfully purchased ${item.EMOJI} ${amt} for :dollar: ${client.utils.comma(item.PRICE * amt)}`),
				],
			});
		}
	},
};