"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "roleinfo",
	aliases: ["roleinfo", "rf"],
	description: "Displays information about a certain role",
	category: "utl",
	guildOnly: true,
	usage: "roleinfo <@role, id or name>",
	async run(client, message, args) {
		if (!args.length) return message.reply("You must specify a role for me to find! You can @mention the role, the ID or the name of the role");
		const role = message.guild.roles.cache.find(x => x.name.toLowerCase() == args.join(" ").toLowerCase()) || message.guild.roles.cache.find(x => x.name.toLowerCase().startsWith(args[0].toLowerCase())) || message.guild.roles.cache.find(x => x.id == args[0]) || (message.mentions.roles.first());
		if (!role) return message.reply({ content: `Unknown Role "${client.utils.trim(args.join(" "), 1888)}"`, allowedMentions: { parse: [] } });
		const members = client.utils.trim(role.members.map(x => x.user.tag).join(", "), 1024);
		const embeds = [
			new MessageEmbed()
				.setColor(role.color ? role.color : "#000000")
				.setTimestamp()
				.setDescription(role.toString())
				.setTitle("Role Information | " + role.name)
				.addField("❯ Role Name", role.name, true)
				.addField("❯ Mention", `\`<@&${role.id}>\``, true)
				.addField("❯ Created On", role.createdAt.toDateString(), true)
				.addField("❯ Color", role.hexColor ? `${role.hexColor} (${role.color})` : "None", true)
				.addField("❯ Position", role.position.toString(), true)
				.addField("❯ Hoisted", role.hoisted ? "Yes" : "No", true)
				.addField(`❯ Members [${role.members.size}]`, members.length ? members : "No one has the " + role + " role", true)
				.setFooter("❯ ID: " + role.id),
		];
		message.reply({ embeds }).catch(() => {return;});
	},
};