"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "editreplacer",
	aliases: ["editreplacer", "changereplacer", "erepl"],
	description: "Edits a replacer's content; format `editreplacer <replacer keyword> <new content>`",
	category: "utl",
	disabled: true,
	async run(client, message, args) {
		if (args.length < 2) return message.reply("You must use the following format in order for this command to work: `" + message.guild ? message.guild.prefix : client.const.prefix + "editreplacer <replacer keyword> <new content>`");
		const kw = args[0].toLowerCase();
		const newContent = args.slice(1).join(" ");
		const data = await client.db.get(`replacers${message.author.id}`) || {};
		if (!Object.keys(data).includes(kw)) {
			return message.reply(`A replacer by that name was not found. Look in \`${message.guild ? message.guild.prefix : client.const.prefix}replacers\` to view a list and \`${message.guild ? message.guild.prefix : client.const.prefix}addreplacer <keyword> <content>\` to add a new one.`);
		}
		const newData = Object.assign({}, data, { [kw]: { content: newContent, created: message.createdTimestamp } });
		await client.db.set(`replacers${message.author.id}`, newData);
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`Successfully edited replacer ${kw}`),
			],
		});
	},
};