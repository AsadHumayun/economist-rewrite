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
		if (item.CST) {
			if (!cst.includes(item.CST)) return message.reply(`You do not own a ${item.EMOJI} ${item.DISPLAY_NAME}... How do you expect to sell it?`);
			cst = cst.filter(f => f !== item.CST);
			const price = item.DISPLAY_NAME == client.const.shopItems[2].items[1].DISPLAY_NAME ? item.PRICE : (BigInt(Math.round(Number(item.PRICE) / 2)));
			await client.utils.updateBalance(message.author, price, message, { a: `sell-itm-${item.DISPLAY_NAME.toLowerCase()}` });
			await client.db.USERS.update({
				cst: cst.join(";"),
			}, {
				where: {
					id: message.author.id,
				},
			});
			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag} has successfully sold ${item.EMOJI} ${item.DISPLAY_NAME} and received :dollar: ${client.utils.digits(price)}`),
				],
			});
		}
		else {
			const amt = isNaN(args[1]) || BigInt(args[1]) < 0n ? 1n : BigInt(args[1]);
			const drgs = message.author.data.get("drgs")?.split(";").map(client.utils.expand) || [];
			if (drgs[item.INDX] - amt < 0n || !drgs[item.INDX]) return message.reply(`You don't have ${item.EMOJI} ${client.utils.digits(amt)}`);
			drgs[item.INDX] -= amt;
			const price = BigInt(BigInt(Math.round(Number(item.PRICE) / 2)) * amt).toString().split(".")[0];
			await client.utils.updateBalance(message.author, price, message, { a: `sell-itm-${item.DISPLAY_NAME.toLowerCase()}-${amt}` });
			await client.db.USERS.update({
				drgs: client.utils.removeZeros(drgs.map(client.utils.format)).join(";"),
			}, {
				where: {
					id: message.author.id,
				},
			});
			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag} has successfully sold ${item.EMOJI} ${client.utils.digits(amt)} and received :dollar: ${client.utils.digits(price)}`),
				],
			});
		}
	},
};