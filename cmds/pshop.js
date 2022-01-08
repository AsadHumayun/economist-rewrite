"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "pshop",
	description: "View a list of permissions which you can buy and the amount of XP needed to buy them!",
	category: "utl",
	async run(client, message) {
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setTitle("XP Shop — " + message.author.tag)
					.setDescription(`
			Here's a list of permissions which you can purchase via \`${message.guild ? message.guild.prefix : client.const.prefix}pbuy <item>\`.
			
			${client.utils.ditems.map((x) => `**${client.capital(x.split(";")[1])}**: \`${x.split(";")[3]}\` XP`).join("\n")}        
							`),
			],
		});
	},
};