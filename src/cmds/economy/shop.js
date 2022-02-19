"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "shop",
	aliases: ["s", "shop"],
	description: "View the current shop!",
	async run(client, message, args) {
		const cst = message.author.data.get("cst")?.split(";") || [];
		const shop = new MessageEmbed()
			.setColor(message.author.color)
			.setAuthor({ name: `Shop - ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
			.setDescription(`:dollar: Current balance - ${client.utils.comma(message.author.data.get("bal") || 0)}\n:moneybag: Total amount in vault - ${client.utils.comma(message.author.data.get("v")?.split(";")[1] || 0)}`);

		client.const.shopItems.forEach(category => {
			shop.addField(category.categoryName, category.items.map(item => `[${item.ID}] ${item.EMOJI}—${item.DISPLAY_NAME}${cst.includes(item.CST) ? ` [${client.const.emoji.tick} **ALREADY PURCHASED**]` : ""}: ${item.DESCRIPTION}—Price: :dollar: ${item.PRICE}`).join("\n").replaceAll("<Prefix>", message.guild?.prefix || client.const.prefix));
		});

		message.reply({ embeds: [shop] });
	},
};