"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "accept",
	aliases: ["accept"],
	description: "Accept someone's staff app",
	cst: "srmod",
	usage: "<member: UserResolvable>",
	ssOnly: true,
	async run(client, message, args) {
		if (!message.member.roles.cache.has(client.const.roles.srmod)) return message.reply({ content: "You must be a **Senior Moderator** in order to accept/decline users' applications." });
		const user = await client.utils.fetchUser(args[0]).catch(() => {return;});
		if (!user) return message.reply({ content: "You must mention a user whose application you wish to accept!" });
		const data = await client.db.getUserData(user.id);
		const cst = (data.get("cst") || "").split(";");
		if (!cst.includes("sbmt")) return message.reply({ content: "That user hasn't submitted their staff application yet!" });
		const ch = message.guild.channels.cache.find((x) => (x.topic || "").toLowerCase().split(";").includes(user.id));
		if (!ch) return message.reply({ content: "That user has not applied for staff." });
		client.channels.cache.get(client.const.channels.appNotifs)
			.send({ content: `Application ${ch} submitted by ${user.tag} (${user.id}) has been **accepted** by ${message.author.tag} (${message.author.id})` });
		const em = new MessageEmbed()
			.setColor(client.const.colors.green)
			.setDescription("Congratulations, your Staff Application has been accepted! Welcome to the team.")
			.addField("Senior Moderator", message.author.tag);
		message.reply({ embeds: [
			new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${user.tag}'s Staff Application has been accepted by ${message.author.tag}; they have been sent the following message:`),
		] });
		message.reply({ embeds: [em] });
		user.send({ embeds: [em] });
		message.guild.member(user.id).roles.add(client.const.roles.mod.trial);
	},
};