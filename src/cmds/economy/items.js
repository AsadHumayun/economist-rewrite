"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "items",
	aliases: ["i", "inventory", "stuff", "items", "collectables"],
	description: "See what items another user has",
	async run(client, message, args) {
		let user = await client.utils.fetchUser(args[0] || message.author.id).catch(() => {return;});
		let data;
		if (!user) {
			user = message.author;
			data = message.author.data;
		}
		else {data = await client.db.getUserData(user.id);}
		const drgs = await data.get("drgs")?.split(";").map(BigInt) || [];
		const itms = client.const.shopItems.map(({ items }) => items.filter(f => typeof f.INDX !== "undefined")).filter(a => a.length >= 1);

		const embed = new MessageEmbed()
			.setColor(message.author.color)
			.setAuthor({ name: `Inventory - ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
		let description = "";
		itms.forEach(i => {
			i.forEach(ITEM => {
				description = `${description}\n${ITEM.EMOJI} ${ITEM.DISPLAY_NAME} - ${!drgs[ITEM.INDX] ? "0" : client.utils.comma(drgs[ITEM.INDX])}`;
			});
		});
		embed.setDescription(description);

		message.reply({
			embeds: [embed],
		});
	},
};