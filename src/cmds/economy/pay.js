"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "pay",
	aliases: ["pay"],
	description: "Pay someone else :dollar:\n\nTo pay someone your entire balance, use `all`. To pay someone half your balance, use `half`. These keywords are specific to this command only, and will **not** work while using others.",
	usage: "<user: UserResolvable> <amount: number>",
	async run(client, message, args) {
		if (args.length < 1) return message.reply("You must mention a user in order for this command to work!");
		function notEnough() {
			return message.reply("That amount exceeds your current balance");
		}
		const authorBal = client.utils.expand(message.author.data.get("bal") || "0");
		const usr = await client.utils.fetchUser(args[0]);
		if (!usr) return message.reply(`Invalid user "${args[0]}"`, { allowedMentions: { parse: [] } });
		if (message.author.id == usr.id) return message.reply("You can't pay yourself!");
		let amt = isNaN(args[1]) ? 1 : args[1].toLowerCase();
		if (amt.toString().startsWith("all")) amt = authorBal;
		if (amt.toString().startsWith("half")) amt = authorBal / 2n;
		amt = Math.trunc(amt);
		if (amt < 1) return message.reply("You must enter a positive number");
		if (isNaN(amt) && (!amt.startsWith("all") || !amt.startsWith("half"))) return message.reply("You must provide a valid number! (or just `all` or `half`)");
		if (authorBal < 0 || (authorBal - amt < 0)) return notEnough();
		if (authorBal - amt < 0) return notEnough();
		await client.utils.updateBalance(message.author, -amt, message, { r: `pay-ac-${usr.tag}(${usr.id})` });
		await client.utils.updateBalance(usr, amt, message, { a: `pay-from-ac-${message.author.tag}(${message.author.id})` });
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`:dollar: ${client.utils.trim(client.utils.comma(client.utils.noExponents(amt)), 1000)} have been transferred to ${usr.tag}'s account`),
			],
		});
	},
};