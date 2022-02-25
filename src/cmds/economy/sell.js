"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "sell",
	aliases: ["sell"],
	description: "Sell some of your items off for some cash!\nNote that you will only receive 50% of the current price of the product. This does not apply to the random colour preference item.",
	usage: "<item: string> <amount: ?number>",
	cst: "slrprmt",
	async run(client, message, args) {
		let cst = await message.author.data.get("cst")?.split(";") || [];
		const ids = (client.const.shopItems.map(({ items }) => items.map(({ ID }) => ID).join(";")).join(";")).split(";");
		if (!ids.includes(args[0])) return message.reply("You must provide a valid ID of what you would like to sell (the ID of an item is the number in brackets next to that item in the shop) in order for this command to work!");
		const item = client.const.shopItems.map(({ items }) => items.find(({ ID }) => ID == args[0])).filter(f => typeof f != "undefined")[0];
		if (!item.SELLABLE) return message.reply("You may not sell that item");
		const bal = Number(message.author.data.get("bal") || 0);
		if (item.CST) {
			if (!cst.includes(item.CST)) return message.reply(`You do not own a ${item.EMOJI} ${item.DISPLAY_NAME}... How do you expect to sell it?`);
			cst = cst.filter(f => f !== item.CST);
			await client.db.USERS.update({
				cst: cst.join(";"),
				bal: item.DISPLAY_NAME == client.const.shopItems[2].items[1].DISPLAY_NAME ? bal + item.PRICE : bal + (item.PRICE / 2),
			}, {
				where: {
					id: message.author.id,
				},
			});
			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag} has successfully sold ${item.EMOJI} ${item.DISPLAY_NAME} and received :dollar: ${client.utils.comma(item.PRICE / 2)}`),
				],
			});
		}
		else {
			const amt = isNaN(args[1]) || Number(args[1]) < 0 ? 1 : Number(args[1]);
			const drgs = message.author.data.get("drgs")?.split(";").map(Number) || [];
			if (drgs[item.INDX] - amt < 0 || !drgs[item.INDX]) return message.reply(`You don't have ${item.EMOJI} ${client.utils.comma(amt)}`);
			drgs[item.INDX] -= amt;
			await client.db.USERS.update({
				drgs: client.utils.removeZeros(drgs).join(";"),
				bal: bal + Math.round((item.PRICE / 2) * amt),
			}, {
				where: {
					id: message.author.id,
				},
			});
			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag} has successfully sold ${item.EMOJI} ${client.utils.comma(amt)} and received :dollar: ${client.utils.comma(Math.round(item.PRICE / 2) * amt)}`),
				],
			});
		}
	},
};