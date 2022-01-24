"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "hug",
	aliases: [ "hug" ],
	description: "Hug someone (only works in the support server)",
	async run(client, message, args) {
		const m = "You must mention somebody to hug!";
		if (!args.length) return message.reply(m);
		const user = await client.utils.fetchUser(args[0]).catch(() => {return;});
		if (!user) return message.reply(m);
		const data = await client.db.getUserData(user.id);
		let hgs = data.get("hgs") || 0;
		hgs++;
		await client.db.USERS.update({
			hgs,
		}, {
			where: {
				id: user.id,
			},
		});
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`:people_hugging: ${message.author.tag} has hugged ${user.tag}`),
			],
		});
	},
};