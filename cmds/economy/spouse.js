"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "spouse",
	aliases: ["spouse"],
	description: "See who someone is married to",
	async run(client, message, args) {
		let usr = await client.utils.fetchUser(args[0]).catch(() => {return;});
		if (!usr) usr = message.author;
		const data = await client.db.getUserData(usr.id);
		const spouse = data.get("spse");
		if (!spouse) return message.reply(`${usr.tag} isn't married to anyone. L`);
		const user = await client.users.fetch(spouse);
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`:two_hearts: ${usr.tag} is currently married to ${user.tag}`),
			],
		});
	},
};