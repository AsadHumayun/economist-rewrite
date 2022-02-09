"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "decline",
	aliases: ["decline"],
	description: "decline someone's staff app",
	ssOnly: true,
	cst: "srmod",
	cstMessage: "You must be a **Senior Moderator** in order to use this command!",
	usage: "<member: UserResolvable>",
	async run(client, message, args) {
		const user = await client.utils.fetchUser(args[0]).catch(() => {return;});
		if (!user) return message.reply("You must mention a user whose application you wish to decline!");
		const data = await client.db.getUserData(user.od);
		if (!data.get("cst").split(";").includes("sbmt")) return message.reply(`That user hasn't submitted their staff application yet! They can do so by using \`${message.guild ? message.guild.prefix : client.const.prefix}submit\``);
		const ch = message.guild.channels.cache.find((x) => (x.topic || "").toLowerCase().split(";").includes(user.id));
		if (!ch) return message.reply("That user has not applied for staff.");
		client.channels.cache.get(client.utils.channels.appNotifs)
			.send(`Application ${ch} submitted by ${user.tag} (${user.id}) has been **declined** by ${message.author.tag} (${message.author.id})`);
		const em = new MessageEmbed()
			.setColor(client.const.channels.colors.red)
			.setDescription("Sorry, but your Staff Application has been declined.")
			.addField("Senior Moderator", message.author.tag)
			.addField("Reason", args.slice(1).join(" ") || "Please contact me for your reason.");
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${user.tag}'s Staff Application has been declined by ${message.author.tag}; they have been sent the following message:`),
				em,
			],
		});
		message.reply({ embed: em });
		user.send({ embed: em })
			.catch((err) => {
				message.channel.send({
					content: `Failed to message ${user.tag} (${user.id}): \`${err}\``,
				});
			});
	},
};