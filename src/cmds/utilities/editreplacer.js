"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "editreplacer",
	aliases: ["editreplacer", "changereplacer", "erepl"],
	description: "Edits a replacer's content",
	usage: "<keyword: string> <new content: string>",
	async run(client, message, args) {
		if (args.length < 2) return message.reply("You must use the following format in order for this command to work: `" + message.guild ? message.guild.prefix : client.const.prefix + "editreplacer <replacer keyword> <new content>`");
		const kw = args[0].toLowerCase();
		const newContent = args.slice(1).join(" ");
		const data = message.author.data.get("replacers") ? JSON.parse(message.author.data.get("replacers")) : {};
		if (!Object.keys(data).includes(kw)) {
			return message.reply(`A replacer by that name was not found. Look in \`${message.guild ? message.guild.prefix : client.const.prefix}replacers\` to view a list and \`${message.guild ? message.guild.prefix : client.const.prefix}addreplacer <keyword> <content>\` to add a new one.`);
		}
		data[kw] = newContent;
		await client.db.USERS.update({
			replacers: JSON.stringify(data),
		}, {
			where: {
				id: message.author.id,
			},
		});
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`Successfully edited replacer "${kw}"`),
			],
		});
	},
};