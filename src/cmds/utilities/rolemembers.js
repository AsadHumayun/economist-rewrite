"use strict";
import { MessageEmbed, Util } from "discord.js";

export default {
	name: "rolemembers",
	aliases: ["rolemem", "rolemembers"],
	description: "View all the members of a specified role; can be either name mention or ID",
	usage: "<role: Snowflake | name>",
	guildOnly: true,
	async run(client, message, args) {
		if (!args.length) return message.reply("You need to like provide a role name/id in order for this command to work!");
		const name = args.join(" ");
		const role = message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find((x) => x.name.toLowerCase() == name.toLowerCase()) || message.guild.roles.cache.find((x) => x.name.toLowerCase().startsWith(name)) || message.guild.roles.cache.get(args[0]);
		if (!role) return message.reply(`A role by the name/id "${name}" cannot be found.`);
		let counter = 1;
		const members = role.members.map((x) => `#${counter++} ${x.user.tag} (${x.id})`).join("\n");
		const msgs = Util.splitMessage(members, { maxLength: 4069, char: "" });
		const embeds = msgs.map((msg, indx) => new MessageEmbed().setTitle(`Members with the ${role.name} role (Page ${indx + 1} of ${msgs.length})`).setColor(message.author.color).setDescription(msg));
		if (embeds.length / 10 <= 1) {
			return message.reply({ embeds });
		}
		else {
			const arr = client.utils.listToMatrix(embeds, 10);
			for (const Embeds of arr) {
				message.author.send({
					emebds: Embeds,
				}).catch(() => {return;});
			}
		}
	},
};