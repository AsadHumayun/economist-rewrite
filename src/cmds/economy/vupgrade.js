"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "vupgrade",
	aliases: ["vupgrade", "vupgr"],
	description: "Upgrade your vault, costing :dollar: 500 at first, but every time you upgrade, the more you'll need to pay the next time you upgrade again.",
	cst: "bvault",
	cstMessage: "You must own a bank vault in order for this command to work!",
	async run(client, message, args) {
		const bal = message.author.data.get("bal");
		const v = message.author.data.get("v").split(";").map(Number);
		v[0] = Number(v[0]);
		if (v[0] == 9999999999) return message.reply("Bruh you already have a maxvault...");
		if ((args[0] || "").toLowerCase() == "max") {
			let cbal = bal;
			let loops = 0;
			let levelups = 0;
			let cbal0;
			while (cbal >= 0) {
				const cost = (v[0] + loops) * 500;
				cbal -= cost;
				if (cbal < 0) {
					cbal0 = cbal + cost;
					break;
				}
				else {
					loops++;
					levelups++;
				}
			}
			if (levelups == 0) return message.reply(`Sorry mate, but you need at least :dollar: ${client.utils.comma(v[0] * 500)} in order to upgrade your bnk vault!`);
			if (cbal < 0) levelups--;

			v[0] += levelups;
			await client.db.USERS.update({
				bal: cbal0,
				v: v.join(";"),
			}, {
				where: {
					id: message.author.id,
				},
			});
			return message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag} has upgraded their Bank Vault to level ${client.utils.comma(v[0])}! It can now hold :dollar: ${client.utils.comma(v[0] * 5000)}`),
				],
			});
		}
		const c = v[0] * 500;
		if (bal - c < 0) return message.reply("You must have at least :dollar: " + client.utils.comma(c) + " in order to upgrade your Bank Vault.");
		v[0]++;
		await client.db.USERS.update({
			bal: bal - c,
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
					.setDescription(`${message.author.tag} has upgraded their Bank Vault to level ${client.utils.comma(v[0])}! It can now hold :dollar: ${client.utils.comma(v[0] * 5000)}`),
			],
		});
	},
};