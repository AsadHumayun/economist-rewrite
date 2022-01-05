"use strict";
import { MessageEmbed, Permissions } from "discord.js";

export default {
	name: "prefix",
	aliases: ["prefix"],
	description: "Edits the server prefix",
	category: "utl",
	async run(client, message, args) {
		if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.reply("You need the `MANAGE_GUILD` permission in order to use this command!");
		const prefix = args[0].trim();
		if (!prefix || prefix.length > 3) return message.reply({ content: `Invalid prefix "${args[0]}"`, alloweMentions: { parse: [] } });
		await client.db.GUILDS.update({
			prefix,
		}, {
			where: {
				id: message.guild.id,
			},
		});
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has successfully updated the server prefix to \`${prefix.toLowerCase()}\``),
			],
		});
		client.channels.cache.get(client.config.statics.defaults.channels.pfx).send(`[${new Date().toISOString()}]: (${message.guild.name} (${message.guild.id}))<${message.author.tag}(${message.author.id})>: ${message.content}`);
	},
};