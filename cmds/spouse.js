"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "spouse",
	aliases: ['spouse'],
	category: 'ecn',
	description: "See who someone is married to",
	async run(client, message, args) {
		let usr = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!usr) {
			usr = message.author;
		};		
		let spouse = await client.db.get("spouse" + usr.id);
		if (!spouse) return message.reply(`${usr.tag} isn't married to anyone. L`);
		let user = await client.users.fetch(spouse);
		let tag = `${user.username}#${user.discriminator}`;
		message.reply({
			embed: new MessageEmbed()
			.setDescription(`:two_hearts: ${usr.tag} is currently married to ${tag}`)
			.setColor(message.author.color)
		});
	},
};