"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "withdraw",
	aliases: ["withdraw", "with", "w"],
	description: "Withdraw money from your Bank Vault and gain it as balance money.",
	cst: "bvault",
	cstMessage: "You must own a bank vault in order for this command to work!",
	async run(client, message, args) {
		const bal = message.author.data.get("bal") || 0;
		const v = message.author.data.get("v").split(";").map(Number);

		if (args[0].toLowerCase() === "max") args[0] = v[1];
		if (isNaN(args[0]) || (Number(args[0]) <= 0)) return message.reply("You must enter a positive number");
		const w = Number(args[0]);
		let curr = v[1];
		if (curr - w < 0) return message.reply("Your vault doesn't contain enough money!");
		curr -= w;
		v[1] = curr;

		await client.db.USERS.update({
			bal: bal + w,
			v: v.join(";"),
		}, {
			where: {
				id: message.author.id,
			},
		});
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has withdrawn :dollar: ${client.utils.comma(w)} form their Bank Vault. Their Bank Vault now has :dollar: ${client.utils.comma(v[1])}`),
			],
		});
	},
};