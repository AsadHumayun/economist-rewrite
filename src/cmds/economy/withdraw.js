"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "withdraw",
	aliases: ["withdraw", "with", "w"],
	description: "Withdraw money from your Bank Vault and gain it as balance money.",
	cst: "bvault",
	usage: "<amount: number>",
	async run(client, message, args) {
		const v = message.author.data.get("v")?.split(";").map(client.utils.expand);

		if (args[0].toLowerCase() === "max") args[0] = v[1];
		if (isNaN(args[0]) || (Number(args[0]) <= 0)) return message.reply("You must enter a positive number");
		const w = BigInt(args[0]);
		let curr = v[1];
		if (curr - w < 0n) return message.reply(`You do not have :dollar: ${client.utils.digits(w)}`);
		curr -= w;
		v[1] = curr;
		await client.utils.updateBalance(message.author, w, message, { r: "vault-with" });
		await client.db.USERS.update({
			v: v.map(client.utils.format).join(";"),
		}, {
			where: {
				id: message.author.id,
			},
		});
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has withdrawn :dollar: ${client.utils.digits(w)} form their Bank Vault\nTheir Bank Vault now has :dollar: ${client.utils.digits(v[1])}`),
			],
		});
	},
};