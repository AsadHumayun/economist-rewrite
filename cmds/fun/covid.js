"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "covid",
	aliases: ["covid", "corona"],
	description: "Infect someone with COVID-19!",
	async run(client, message, args) {
		if (!message.author.data.get("cst").split(";").includes("covid")) return message.reply("You're not allowed to use this command! You can unlock it by getting infected with COVID-19!");
		const user = await client.utils.fetchUser(args[0]).catch(() => {return;});
		if (!user) return message.reply("You must mention somebody to infect!");
		const data = await client.db.getUserData(user.id);
		const cst = data.get("cst") ? data.get("cst").split(";") : [];
		if (cst.includes("covid")) return message.reply("That user is already infected with COVID-19!");
		if (cst.includes("vcn") || (user.bot)) {
			message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`Oh my, it seems that ${user.tag} is vaccinated!`),
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${user.tag}'s body recognises COVID-19's antigens, and has destroys them...`),
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${user.tag} remains unshackled by COVID-19!`),
				],
			});
		}
		else {
			cst.push("covid");
			await client.db.USERS.update({
				cst: cst.join(";"),
			}, {
				where: {
					id: user.id,
				},
			});
			message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag} has coughed all over ${user.tag}, and infected them with COVID-19!`),
				],
			});
		}
	},
};