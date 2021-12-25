const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "pay",
	aliases: ["pay"],
	category: "ecn",
	description: "Pay someone else :dollar:\n\nTo pay someone your entire balance, use `all`",
	usage: "pay <user> <amount>",
	async run(client, message, args) {
		if (args.length < 1) return message.reply("You must mention a user in order for this command to work!");
		/**
		 * Tells the `user` they don't have enough money t pay someone else.
		 */
		function notEnough() {
			return message.reply("You don't have enough :dollar: in your bank!");
		}
		let authorBal = await client.db.get("bal" + message.author.id) || 0;
		authorBal = Number(authorBal);
		const usr = await client.config.fetchUser(args[0]);
		if (!usr) return message.reply(`Invalid user "${args[0]}"`, { allowedMentions: { parse: [] } });
		if (message.author.id == usr.id) return message.reply("You can't pay yourself!");
		let amt = isNaN(amt) ? 1 : args[1].toLowerCase();
		if (amt.toString().startsWith("all")) amt = authorBal;
		if (amt.toString().startsWith("half")) amt = authorBal / 2;
		amt = Number(amt);
		amt = Math.trunc(amt);
		if (amt < 1) return message.reply("You must enter a positive number.");
		if (isNaN(amt) && (!amt.startsWith("all") || !amt.startsWith("half"))) return message.reply("You must provide a valid number! (or just `all`|`half`)");
		if (authorBal < 0 || (!authorBal) || (Number(authorBal - amt) < 0)) return notEnough();
		const amountLeft = authorBal - amt;
		if (amountLeft < 0) return notEnough();
		await client.db.set("bal" + message.author.id, amountLeft);
		let oldBal = message.author.data.get("bal") || 0;
		oldBal = Number(oldBal);
		const newBal = Number(oldBal + amt);
		await client.db.set("bal" + usr.id, newBal);
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has paid :dollar: ${client.config.comma(amt)} (${amt.toString().length} digits) into ${usr.tag}'s account`),
			],
		});
	},
};