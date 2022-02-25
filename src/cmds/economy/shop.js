"use strict";
import { MessageEmbed } from "discord.js";
import { inspect } from "util";
import { Util } from "discord.js";

export default {
	name: "shop",
	aliases: ["s", "shop"],
	description: "View the current shop!",
	async run(client, message) {
		const cst = message.author.data.get("cst")?.split(";") || [];
		const shop = new MessageEmbed()
			.setColor(message.author.color)
			.setAuthor({ name: `Shop - ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
			.setDescription(`:dollar: Current balance - ${client.utils.comma(message.author.data.get("bal") || 0)}\n:moneybag: Total amount in vault - ${client.utils.comma(message.author.data.get("v")?.split(";")[1] || 0)}`);

		client.const.shopItems.forEach(category => {
	//		category.items.forEach(console.log)
			shop.addField(
				category.categoryName,
				category.items.map(item => `[${item.ID}] ${item.EMOJI} ${item.DISPLAY_NAME}${cst.includes(item.CST) ? ` [${client.const.emoji.tick} **ALREADY PURCHASED**]` : ""}: ${item.DESCRIPTION}——Price: :dollar: ${client.utils.comma(item.PRICE)}`).join("\n").replaceAll("<Prefix>", message.guild?.prefix || client.const.prefix)
			)
		})
		/*
		client.const.shopItems.forEach(category => {
		//	console.log(category.items, Array.isArray(category.items))
			shop.addField(
				category.categoryName,
				category.items.map(item => {
				console.log(item)
			return //.join("\n").replaceAll("<Prefix>", message.guild?.prefix || client.const.prefix));
		}))
		*/
		message.reply({ embeds: [shop] });
	},
};