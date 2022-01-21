"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "unmute",
	aliases: ["unmute", "un-mute"],
	description: "unmutes a user.",
	ssOnly: true,
	cst: "tmod",
	async run(client, message, args) {
		const usr = await client.utils.fetchUser(args[0]).catch(() => {return;});
		if (!usr) return message.reply({ content: `Invalid user "${args[0]}"`, allowedMentions: { parse: [] } });
		const member = await message.guild.members.fetch(usr.id).catch(() => {return;});
		if (!member) return message.reply(`${client.const.emoji.err} The specified user is not a member of this server`);
		if (!member.roles.cache.has(client.const.roles.muted)) {
			return message.reply(`${client.const.emoji.err} ${member.user.tag} isn't muted... how are you gonna unmute them?`);
		}
		const dm = new MessageEmbed()
			.setColor(client.const.colors.green)
			.setDescription(`Your mute has been removed in ${message.guild.name}`)
			.addField("Moderator", message.author.tag, true)
			.addField("Reason", args.slice(1).join(" ") || "No reason given", true);
		await member.roles.remove(client.const.roles.muted);
		await client.db.USERS.update({
			mt: null,
		}, {
			where: {
				id: usr.id,
			},
		});
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${client.const.emoji.tick} ${member.user.tag} has been unmuted and was sent the following message:`),
				dm,
			],
		});
		member.send({ embeds: [ dm ] }).catch(() => {return;});
	},
};