"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "mute",
	aliases: ["mute"],
	description: "Mutes a user",
	category: "mod",
	ssOnly: true,
	cst: "tmod",
	async run(client, message, args) {
		const usr = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!usr) return message.reply(`${client.config.statics.defaults.emoji.err} I can't seem to find that user...`);
		const member = message.guild.members.cache.get(usr.id);
		if (!member) return message.reply("The specified user is not a member of this server");
		if (member.roles.cache.has(client.config.statics.defaults.roles.mod.trial)) return message.reply(`${client.config.statics.defaults.emoji.err} You're not allowed to mute a moderator!`);
		await member.roles.add(client.config.statics.defaults.roles.muted);
		const amt = Number(args[1]);
		if (isNaN(amt) || (!args[1])) return message.reply(`${client.config.statics.defaults.emoji.err} You must provide a valid length (in minutes). For permanent mutes, use 0 as the length.`);
		let reason = args.slice(2).join(" ");
		if (!reason) reason = "Moderator didn't specify a reason.";
		await client.db.USERS.update({
			mt: `${amt == 0 ? "-1" : Math.trunc((message.createdTimestamp + (amt * 60000)) / 60_000)};${reason}`,
		}, {
			where: {
				id: usr.id,
			},
		});
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${client.config.statics.defaults.emoji.tick} ${member.user.tag} was given a ${amt == 0 ? "permanent" : `${amt} minute`} mute because of "${reason}"; they have been sent the following message:`),
			],
		});
		const dm = new MessageEmbed()
			.setDescription(`You have received a ${amt == 0 ? "permanent" : `${amt} minute`} mute from ${message.guild.name}. Please contact ${client.users.cache.get(client.config.owner).tag} if you believe that this is an unjust mute. You may leave and rejoin the server after the time specified has passed in order to have your mute removed.`)
			.setColor(client.config.statics.defaults.colors.red)
			.addField("Moderator", message.author.tag)
			.addField("Reason", reason);
		message.channel.send({ embeds: [dm] });
		member.send({ embeds: [dm] })
			.catch(() => {return;});
		if ((amt * 60_000) >= 0x7FFFFFFF || amt == 0) return;
		setTimeout(async () => {
			if (!member.roles.cache.has(client.config.statics.defaults.roles.muted)) return;
			member.roles.remove(client.config.statics.defaults.roles.muted);
			member.send({
				embeds: [
					new MessageEmbed()
						.setDescription(`Your mute has been removed in ${message.guild.name}`)
						.setColor(client.config.statics.defaults.colors.green)
						.addField("Moderator", client.user.tag)
						.addField("Reason", "<[Action:Auto-MEMBER.UNMUTE]>: Time's up!"),
				],
			});
			await client.db.USERS.update({
				mt: null,
			}, {
				where: {
					id: usr.id,
				},
			});
			client.channels.cache.get(client.config.statics.defaults.channels.modlog).send(`${Date.now() / 60_000}: (${message.guild.name} [${message.guild.id}])[${message.channel.name}]<${client.user.tag} (${client.user.id})>: unmute ${member.id} R: mute time of ${amt} minutes has passed`);
		}, amt * 60_000);
	},
};