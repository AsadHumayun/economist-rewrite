"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "deposit",
	aliases: ["deposit", "dep"],
	description: "Deposit money into your Bank Vault.",
	category: "ecn",
	cst: "bvault",
	cstMessage: "You must own a Bank Vault in order for this command to work!",
	async run(client, message, args) {
		if (isNaN(args[0]) || (Number(args[0]) <= 0)) return message.reply("You must enter a positive number");
		const dep = Number(args[0]);
		const bal = message.author.data.get("bal") || 0;
		if (bal - dep < 0) return message.reply("Your current balance is insufficient to make this transaction!");
		const v = message.author.data.get("v").split(";").map(Number);
		const capacity = v[0] * 5_000;
		let curr = v[1];
		if (curr + dep > capacity && (v[0] < 9999999999)) return message.reply(`Your vault does not have enough space to hold that much money; upgrade your vault with \`${message.guild ? message.guild.prefix : client.const.prefix}vupgrade\` in order to increase your Bank Vault's capacity!`);
		curr += dep;
		v[1] = curr;
		await client.db.USERS.update({
			bal: bal - dep,
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
					.setDescription(`${message.author.tag} has deposited :dollar: ${client.utils.comma(client.utils.noExponents(dep))} into their secure bank vault, which now holds a total of :dollar: ${client.utils.comma(client.utils.noExponents(v[1]))}`),
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`They now have :dollar: ${client.utils.comma(client.utils.noExponents(bal - dep))} left in their balance!`),
			],
		});
	},
};