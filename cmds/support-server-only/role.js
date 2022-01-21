"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "role",
	aliases: ["role"],
	description: "adds/removes a role from someone only if you own an assignable role :D",
	ssOnly: true,
	async run(client, message, args) {
		if (args.length < 2) return message.reply("You must provide a valid role keyword followed by the target user!");
		let roles = message.author.data.get("cstmrl");
		if (!roles) return message.reply(`${client.const.emoji.err} You do not own any custom roles.`);

		roles = client.utils.listToMatrix(roles.split(";"), 2);
		const key = args[0].toLowerCase();
		const kw = roles.map((x) => x[0]);
		if (!kw.includes(key)) {
			return message.reply(`A role by that keyword was not found. Please use \`${message.guild ? message.guild.prefix : client.const.prefix}roles\` to view a list of roles that you own. If you are still having trouble, please message ${client.users.cache.get(client.const.display).tag}.`);
		}

		let role = roles.find((x) => x[0] == key);
		role = message.guild.roles.cache.get(role[1]);
		const usr = await client.utils.fetchUser(args[1]).catch(() => {return;});
		if (!usr) return message.reply("You must specify a user in order for this command to work!");

		const guildMember = await message.guild.members.fetch(usr.id).catch(() => {return;});
		if (!guildMember) return message.reply(`${client.const.emoji.err} ${usr.tag} is not a member of this server`);
		if (guildMember.roles.cache.has(role.id)) {
			await guildMember.roles.remove(role.id);
			return message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${usr.tag} has lost the ${role.name} role`),
				],
			});
		}
		else {
			await guildMember.roles.add(role.id);
			return message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${usr.tag} has received the ${role.name} role`),
				],
			});
		}
	},
};