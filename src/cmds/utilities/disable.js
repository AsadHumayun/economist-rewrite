"use strict";

import { Permissions, MessageEmbed } from "discord.js";

export default {
	name: "disable",
	aliases: ["disable"],
	description: "Dsiable (or enable) commands in a certain channel. If commands are disabled, then the bot will ignroe any commands that are sent in the channel.",
	async run(client, message) {
		if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.reply("You must have the `MANAGE_GUILD` permission in order to use this command!");
		const data = await client.db.CHNL.findByPk(message.channel.id);
		if (data.get("dsbs") === true) {
			await client.db.CHNL.update({
				dsbs: false,
			}, {
				where: {
					id: message.channel.id,
				},
			});
			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`Commands will now be parsed in #${message.channel.name}`),
				],
			});
		}
		else {
			await client.db.CHNL.update({
				dsbs: true,
			}, {
				where: {
					id: message.channel.id,
				},
			});
			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`Commands will now be ignored in #${message.channel.name}`),
				],
			});
		}
	},
};