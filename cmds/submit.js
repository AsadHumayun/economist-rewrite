"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "submit",
	aliases: ["submit"],
	description: "Submit your staff application",
	ssOnly: true,
	async run(client, message) {
		const cst = message.author.data.get("cst")?.split(";") || [];
		if (cst.includes("sbmt")) return message.reply("You've already submitted your staff application!");
		const ch = message.guild.channels.cache.find((x) => (x.topic || "").toLowerCase().split(";").includes(message.author.id));
		if (!ch) return message.reply("You haven't even applied for staff yet!");
		cst.push("sbmt");
		client.channels.cache.get(client.config.channels.appNotifs).send(`Application ${ch} submitted by ${message.author.tag} (${message.author.id}). Pending review.`);
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription("Your staff application has been forwarded to the staff team. Please wait patiently for a response!\n\n> Please do not ask moderators about the status of your staff application. We will reach out to you if you have managed to attain the role within two weeks of your application's submission."),
			],
		});
		await client.db.USERS.update({
			cst: cst.join(";"),
		}, {
			where: {
				id: message.author.id,
			},
		});
	},
};