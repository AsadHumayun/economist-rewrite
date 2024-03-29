"use strict";
import { MessageEmbed } from "discord.js";
import delay from "delay";
import ms from "ms";

export default {
	name: "coinflip",
	aliases: ["coinflip", "cf"],
	description: "Bet X amount of money onto whether you get heads or tails and gain/lose it all",
	usage: "<coin: \"h\" or \"t\"> <bet: ?number>",
	async run(client, message, args) {
		const scd = Math.round(((message.author.data.get("cfc") * 60_000) - message.createdTimestamp) / 1000);
		if (scd > 0) return message.reply(`You must wait ${scd} seconds before flipping another coin!`);
		if (!(args[0] && (args[0].toLowerCase().startsWith("h") || (args[0].toLowerCase().startsWith("t"))))) return message.reply(`You must specify either "h" or "t" and a bet under the format \`${message.guild ? message.guild.prefix : client.const.prefix}coinflip <h or t> <bet>\` in order for this command to work!`);
		const res = Math.round(Math.random()) == 1 ? "heads" : "tails";
		const bal = client.utils.expand(message.author.data.get("bal"));
		const bet = isNaN(args[1]) ? 1n : BigInt(args[1]);
		if (bal - bet < 0n || (bet < 0n)) return message.reply("That number exceeds your current balance");
		await client.utils.updateBalance(message.author, -bal, message, { r: "coinflip-bet-reset-bal" });
		await client.db.USERS.update({
			cfc: client.utils.parseCd(message.createdTimestamp, ms("2m"), true),
		}, {
			where: {
				id: message.author.id,
			},
		});
		let e = new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(`Coinflip - ${message.author.tag} (💵 ${client.utils.digits(bet)})`)
			.setDescription("**Flipping a coin...**");
		const msg = await message.reply({ embeds: [e] });
		const cst = message.author.data.get("cst")?.split(";") || [];
		await delay(2000);
		if ((res.startsWith(args[0]) || (cst.includes("cfw"))) && (!cst.includes("cfl"))) {
			const sads = [":(", ":/", ":c", ";(", ">:(", "(´；ω；`)", "(＃ﾟДﾟ)"];
			e = e.setDescription(`It landed ${res} up ${sads[Math.floor(Math.random() * sads.length)]}... here's your :dollar: ${client.utils.digits(bet)} bet back, along with an extra :dollar: ${client.utils.digits(bet)} :((`);
			msg.edit({ embeds: [e] });
			await client.utils.updateBalance(message.author, bal + (bet * 2n), message, { a: `coinflip-${res},${args[0]}` });
		}
		else {
			await client.utils.updateBalance(message.author, bal - bet, message, { a: `coinflip-${res},${args[0]}` });
			e = e.setDescription(`It landed ${res} up! Thanks for the free :dollar: ${client.utils.digits(bet)}, see you next time!`).setColor("#da0000");
			msg.edit({ embeds: [e] });
		}
	},
};