"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "deposit",
	aliases: ["deposit", "dep"],
	description: "Deposit money into your Bank Vault.",
	usage: "<money: number>",
	cst: "bvault",
	async run(client, message, args) {
		if (isNaN(args[0]) || (BigInt(args[0]) <= 0n)) return message.reply("You must enter a positive number");
		const dep = BigInt(args[0]);
		const bal = client.utils.expand(message.author.data.get("bal"));
		if (bal - dep < 0n) return message.reply("Your current balance is insufficient to make this transaction!");
		const v = message.author.data.get("v").split(";").map(client.utils.expand);
		const capacity = v[0] * 5_000n;
		console.log("v[1]", v[1] + dep, client.utils.format(v[1] + dep));
		let curr = v[1];
		if (curr + dep > capacity && (v[0] < 9999999999n)) return message.reply(`Your vault does not have enough space to hold that much money; upgrade your vault with \`${message.guild ? message.guild.prefix : client.const.prefix}vupgrade\` in order to increase your Bank Vault's capacity!`);
		curr += dep;
		v[1] = curr;
		await client.utils.updateBalance(message.author, -dep, message, { r: "vault-dep" });
		await client.db.USERS.update({
			v: v.map(client.utils.format).join(";"),
		}, {
			where: {
				id: message.author.id,
			},
		});
		// console.log(`${message.author.tag} has deposited :dollar: ${client.utils.digits(dep)} into their secure bank vault, which now holds a total of :dollar: ${client.utils.digits(v[1])}`)
		// console.log(`They now have :dollar: ${client.utils.format(bal - dep)} left in their balance!`)
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has deposited :dollar: ${client.utils.digits(dep)} into their secure bank vault, which now holds a total of :dollar: ${client.utils.digits(v[1])}`),
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`They now have :dollar: ${client.utils.digits(bal - dep)} left in their balance!`),
			],
		});
	},
};