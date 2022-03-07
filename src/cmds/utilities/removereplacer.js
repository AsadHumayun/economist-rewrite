"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "removereplacer",
	aliases: ["replacer.removeone", "removereplacer", "repl.rem", "delreplacer"],
	description: "Removes a replacer/supplanter.",
	usage: "<keyword: string>",
	async run(client, message, args) {
		const data = message.author.data.get("replacers") ? JSON.parse(message.author.data.get("replacers")) : {};
		const keyword = args[0].toLowerCase();
		if (!Object.keys(data).includes(keyword)) {
			return message.reply(`No supplanter by that name was found. Please look in \`${message.guild ? message.guild.prefix : client.const.prefix}replacers\` to view a list of all your currently active replacers.`);
		}
		else {
			delete data[keyword];
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
						.setDescription(`Leave it to me! I've removed the "${keyword}" replacer`),
				],
			});
		}
	},
};