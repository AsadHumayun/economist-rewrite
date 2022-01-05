"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: 'removereplacer',
	aliases: ['replacer.removeone', 'removereplacer', 'repl.rem', 'delreplacer'],
	category: 'utl',
	description: 'Removes a replacer/supplanter.',
	disabled: true,
	async run(client, message, args) {
		const data = await client.db.get(`replacers${message.author['id']}`) || {};
		if (typeof data != 'object') return message.reply("There was an error whilst parsing your role data: `TypeError: User#Supplanters must be of type Object or null`\nContact an admin asking them to remove your role data!");

		var keyword = args[0].toLowerCase();
		if (!Object.keys(data).includes(keyword)) {
			return message.reply(`No supplanter with name "${keyword}" was found. Please look in \`${message.guild.prefix}replacers\` to view a list of all your currently active replacers.`);
		} else {
			const newData = data;
			delete data[keyword];
			await client.db.set(`replacers${message.author.id}`, newData)
			message.reply({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`Leave it to me! I've removed the "${keyword}" replacer`)
			})
		}
	},
}