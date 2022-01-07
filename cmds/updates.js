"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "updates",
	aliases: ["updates", "announcements"],
	category: "utl",
	description: "Adds/removes the updates role. Haing it means you'll get pinged when there are new updates and additions to the bot.",
	async run(client, message) {
		const guild = client.guilds.cache.get(client.config.statics.supportServer);
		const mem = await guild.members.fetch(message.author.id).catch(() => {return;});
		if (!mem) return message.reply(`I cannot find a user by ID "${message.author.id}" in the support server.`);
		let cst = message.author.data.get("cst")?.split(";") || [];
		if (mem.roles.cache.has(client.config.statics.defaults.roles.updates)) {
			cst = cst.filter((x) => x != "updt");
			mem.roles.remove(client.config.statics.defaults.roles.updates);
			message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag} will no longer get mentioned for future updates and announcements`),
				],
			});
		}
		else {
			mem.roles.add(client.config.statics.defaults.roles.updates);
			cst.push("updt");
			await message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag} will now get mentioned for future updates and announcements`),
				],
			});
			await client.db.USERS.update({
				cst: cst.join(";"),
			}, {
				where: {
					id: message.author.id,
				},
			});
		}
	},
};