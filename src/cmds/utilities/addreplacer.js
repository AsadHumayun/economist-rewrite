"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "addreplacer",
	aliases: ["addreplacer", "replaceradd", "newreplacer"],
	description: "This command will add a replacer. For more information on what a replacer is, please use `<Prefix>help replacers`",
	usage: "<keyword: string> <...content: string>",
	async run(client, message, args) {
		if (args.length < 2) return message.reply({ content: `You must specify a replacer keyword and its content under the format of \`${message.guild ? message.guild.prefix : client.const.prefix}addreplacer <name> <content>\`; for example \`${message.guild ? message.guild.prefix : client.const.prefix}addreplacer firstname Alan\`.` });
		const data = message.author.data.get("replacers") ? JSON.parse(message.author.data.get("replacers")) : {};
		const keyword = args[0].toLowerCase();
		const content = args.slice(1).join(" ");
		if (Object.keys(data).includes(keyword)) return message.reply({ content: "A replacer by that name already exists. Please consider editing it instead!" });
		if (content.length > 500) return message.reply({ content: `${client.const.emoji.err} Your replacer content may not exceed 500 characters.` });
		if (Object.keys(data).length > 10 && !client.const.owners.includes(message.author.id)) return message.reply({ content: "You may not have more than 10 instantaneous replacers; please remove one before adding more!" });
		data[keyword] = content;
		await client.db.USERS.update({
			replacers: JSON.stringify(data),
		}, {
			where: {
				id: message.author.id,
			},
		});

		message.reply({ embeds: [
			new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`Successfully added replacer "${keyword}"`),
		] });
	},
};