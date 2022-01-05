"use strict";
import { MessageEmbed, Permissions } from "discord.js";

export default {
	name: "unban",
	aliases: ["unban"],
	description: "unbans a user from the current guild.",
	category: "mod",
	cst: "moderator",
	ssOnly: true,
	async run(client, message, args) {
		if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.reply("You must have the BAN_MEMBERS permission in order to use this command!");
		if (!args.length) return message.reply("You must follow the format of `" + message.guild.prefix + "unban <user> [reason]`");
		const user = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!user) return message.reply(`${client.config.statics.defaults.emoji.err} You have provided an invalid user!`);
		const reason = args.slice(1).join(" ") || "No reason given";
		const Notification = new MessageEmbed()
			.setColor(client.config.statics.defaults.colors["green"])
			.setDescription(`You have been unbanned from ${message.guild.name}. Please conduct yourself appropriately, in a manner such that you do not get banned again. [Support Server Invite](${client.config.statics.ssInvite})`)
			.addField("Moderator", message.author.tag)
			.addField("Reason", reason);

		const msgs = [`${client.config.statics.defaults.emoji.tick} ${user.tag}'s ban has been removed because of "${reason || "<UNKNOWN REASON>"}"; they have been sent the following message:`];
		await message.guild.members.unban(user.id);
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(msgs[0]),
				Notification,
			],
		});
		client.users.cache.get(user.id).send({ embed: [ Notification ] }).catch(() => {return;});
	},
};