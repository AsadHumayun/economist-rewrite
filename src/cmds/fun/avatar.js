"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "avatar",
	aliases: ["avatar", "av", "pfp"],
	description: "View someone's avatar - works for people who are not in the current server too",
	async run(client, message, args) {
		if (!args.length) args = [message.author.id];
		let user = await client.utils.fetchUser(args[0])
			.catch(() => {return;});
		if (!user) user = message.author;
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setImage(user.displayAvatarURL({ dynamic: true, format: "png" }))
					.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: false, format: "png" }) }),
			],
		});
	},
};