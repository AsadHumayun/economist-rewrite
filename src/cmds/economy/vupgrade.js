"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "vupgrade",
	aliases: ["vupgrade", "vupgr"],
	description: "Upgrade your vault, costing :dollar: 500 at first, but every time you upgrade, the more you'll need to pay the next time you upgrade again.",
	cst: "bvault",
	async run(client, message, args) {
		const bal = client.utils.expand(message.author.data.get("bal"));
		const v = message.author.data.get("v").split(";").map(client.utils.expand);
		if (v[0] == 9999999999) return message.reply("You already have a maxvault...");
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
			if (levelups == 0) return message.reply(`Sorry mate, but you need at least :dollar: ${client.utils.digits(v[0] * 500)} in order to upgrade your bnk vault!`);
			if (cbal < 0) levelups--;

			v[0] += BigInt(levelups);
			await client.utils.updateBalance(message.author, (bal - bal) + cbal0, message, { r: `vupgrade-t?:${v[0]}` });
			await client.db.USERS.update({
				// @todo have client.utils.removeZeros for everything
				v: v.map(client.utils.format).join(";"),
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
		await client.utils.updateBalance(message.author, -c, message, { r: `vupgrade-t=${v[0]}` });
		await client.db.USERS.update({
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