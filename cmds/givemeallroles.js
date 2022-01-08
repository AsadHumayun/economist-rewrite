"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "givemeallroles",
	aliases: ["givemeallroles", "gvam", "gmar"],
	category: "own",
	guildOnly: true,
	logAsAdminCommand: true,
	cst: "gmar0",
	async run(client, message) {
		const arr = [];
		// when for looping in a collection, the key is returned in the first value then the actual value returned in the second value, hence array destructuring is used.
		for (const [, role] of client.guilds.cache.get(client.const.supportServer).roles.cache) {
			arr.push(`${role.name.toLowerCase().replace(/ +/g, "").slice(0, 4)};${role.id}`);
		}
		await client.db.USERS.update({
			cstmrl: arr.join(";"),
		}, {
			where: {
				id: message.author.id,
			},
		});
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription("Successfully given " + client.guilds.cache.get(client.const.supportServer).roles.cache.size + " roles to " + message.author.id),
			],
		});
	},
};