"use strict";
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "buy",
	aliases: ["buy", "purchase"],
	description: "Buy something from the overpriced shop",
	category: "ecn",
	usage: "<item index: number>",
	async run(client, message, args) {
		function alreadyOwned() {
			return message.reply("You already seem to own that item!");
		}

		if (!args.length) return message.reply("You must provide a valid ID of what you would like to purchase (the ID of an item is the number in brackets next to that item) in order for this command to work!");
		const id = Number(args[0]);
		const items = Object.entries(client.config.statics.shop);
		// eslint-disable-next-line no-shadow
		const ids = items.map(([, { id }]) => id);
		// <LogicError <IfStatement>>: if statement not running
		// <NOW FIXED>: `id` was not of data type `Number`.
		if (!ids.includes(id)) return message.channel.send({ content: `Invalid ID "${args[0]}"`, allowedMentions: { parse: [] } });
		let bal = message.author.data.get("bal") || 0;
		const item = items.find((f) => f[1].id == id);
		const cst = message.author.data.get("cst") ? message.author.data.get("cst").split(";") : [];
		if (item[1].method == "cst" && (cst.includes(item[0]))) return alreadyOwned();
		if (eval(item[1].condt)) return alreadyOwned();
		if (bal - item[1].price < 0) return message.reply(`You do not have enough money to purchase "${item[1].displayName}"; you need an additional :dollar: ${item[1].price - bal} on top of your current balance in order to purchase this item!`);
		bal -= item[1].price;
		if (item[1].method == "cst") {
			cst.push(item[0]);
		}
		else if (item[1].method.split(".").length == 2) {
			const key = item[1].method.split(".")[0];
			const indx = item[1].method.split(".")[1];

			let values = message.author.data.get(key) || "0;0;0;0;0;0;0;0;0;0;0;0";
			values = values ? values.split(";") : [];
			// prevent an out of bounds type error from occurring by extending the array in a manner such that
			// arr[indx] is 0 and can thus be incremented without error. (arr[anything in between 0 and indx] is also therefore registered as "")
			if (!values[indx]) values[indx] = "0";
			values = values.map((f) => isNaN(f) ? 0 : Number(f));
			// give the user the ability to specify a number of item that they wish to purchase.
			// prevents spam, makes the bot look and feel more complete.
			values[indx] += isNaN(args[1]) ? 1 : Number(args[1]);

			await client.db.USERS.uddate({
				[key]: values.join(";"),
			}, {
				where: {
					id: message.author.id,
				},
			});
		}
		else {
			await item[1].execute(message.author.id);
		}
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has successfully purchased a ${item[1].emoji} ${item[1].displayName}!`),
			],
		});
		await client.db.USERS.update({
			bal: bal,
			cst: cst.join(";"),
		}, {
			where: {
				id: message.author.id,
			},
		});
	},
};