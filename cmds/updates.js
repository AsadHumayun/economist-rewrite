"use strict";
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "updates",
	aliases: ['updates', 'announcements'],
	category: 'utl',
	description: "Adds/removes the updates role. Haing it means you'll get pinged when there are new updates and additions to the bot.",
	async run(client, message, args) {
		const guild = client.guilds.cache.get(client.config.statics.supportServer);
		const mem = guild.member(message.author.id);
		if (!mem) return message.reply(`Looks like you're not in my support server. Why not join? :D ${client.config.ssInvite}`);
		let cst = await client.db.get("cst" + message.author.id) || "";
				cst = cst.split(";");
		if (cst.includes("updt")) {
			cst = cst.filter((x) => x != "updt");
			await mem.roles.remove(client.config.roles.updates);
			message.reply({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} will no longer get mentioned for future updates and announcements.`)
			})
			await client.db.set("cst" + message.author.id, cst.join(";"))
		} else {
			mem.roles.add(client.config.roles.updates) 
			cst.push("updt");
			await message.reply({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} will now get mentioned for future updates and announcements.`)
			})
			await client.db.set("cst" + message.author.id, cst.join(";"))
		};
	},
};