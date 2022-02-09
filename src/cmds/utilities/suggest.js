"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "suggest",
	aliases: ["suggest", "addsmthnew"],
	description: "Suggest a new idea to be added to the bot; will be posted in <#758598514623643690>",
	usage: "<suggestion: string>",
	async run(client, message, args) {
		const scnd = client.utils.cooldown(message.createdTimestamp, (message.author.data.get("sgstc") || 0) * 60_000);
		if (scnd) return message.reply(`You must wait another ${scnd} before suggesting again`);

		if (!args.length) return message.reply("You must provide a suggestion for this command to work!");
		await client.db.USERS.update({
			sgstc: client.utils.parseCd(message.createdTimestamp, 20000, true),
		}, {
			where: {
				id: message.author.id,
			},
		});
		const suggest = args.join(" ");
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`Thanks ${message.author.tag}, your suggestion has been received!`),
			],
		});
		client.channels.cache.get(client.const.channels.suggestions).send({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setAuthor({ name: `${message.author.tag} (${message.author.id})`, iconURL: message.author.displayAvatarURL({ dynamic: false }), url: message.url })
					.setDescription(suggest),
			],
		})
			.then((m) => { m.react("👍"); m.react("👎"); });
	},
};