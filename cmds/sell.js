"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "sell",
	aliases: ["sell"],
	description: "Sell some of your items off",
	category: "ecn",
	disabled: true,
	async run(client, message, args) {
		let cst = await client.db.get("cst" + message.author.id) || "";
		cst = cst.split(";");
		if (!cst.includes("slrprmt")) return message.reply("You must own a :receipt: Seller's Permit in order to sell items!");
		function identify(x) {
			if (x.startsWith("dolp")) {
				return {
					item: [ "Dolphin", ":dolphin:", 0 ],
					rate: 20,
				};
			}
			else if (x.startsWith("sha")) {
				return {
					item: [ "Shark", ":shark:", 1 ],
					rate: 50,
				};
			}
			else if (x.startsWith("blow")) {
				return {
					item: [ "Blowfish", ":blowfish:", 2 ],
					rate: 1,
				};
			}
			else if (x.startsWith("tro")) {
				return {
					item: [ "Tropical Fish", ":tropical_fish:", 3 ],
					rate: 100,
				};
			}
			else if (x.startsWith("fish")) {
				return {
					item: [ "Fish", ":fish:", 4 ],
					rate: 19,
				};
			}
			else if (x.startsWith("ch")) {
				return {
					item: [ "Chill Pills", client.utils.emoji.chill ],
					rate: 50,
				};
			}
		}
		const item = (args[0] || "").toLowerCase();
		const identified = identify(item);
		if (!identified) return message.reply("You can sell the following in-game items: `dolphin`, `shark`, `blowfish`, `tropical-fish`, `fish` and `chillpills`");
		if (isNaN(args[1])) args[1] = 1;
		if (args[1] <= 0) return message.reply("You must provide a positive number");
		const amt = Number(args[1]);
		let bal = await client.db.get("bal" + message.author.id) || "0";
		bal = Number(bal);
		const amtGained = (amt * identified.rate);

		if (identified.item.length > 2) {
			// selling a fish
			let fish = await client.db.get("fsh" + message.author.id) || "0;0;0;0;0";
			fish = fish.split(";");
			for (x in fish) {
				fish[x] = Number(fish[x]);
			}
			if (fish[identified.item[2]] < amt) return message.reply(`You don't have enough ${identified.item[1]} ${identified.item[0]}`);
			fish[identified.item[2]] = fish[identified.item[2]] - amt;
			fish = fish.join(";");
			bal = bal + amtGained;
			await client.db.set("fsh" + message.author.id, fish);
			await client.db.set("bal" + message.author.id, bal);
		}
		else {
			let ch = await client.db.get("chillpills" + message.author.id) || "0";
			ch = Number(ch);
			if (ch < amt) return message.reply(`You don't have enough ${identified.item[1]} ${identified.item[0]}`);
			ch = ch - amt;
			bal = bal + amtGained;
			await client.db.set("chillpills" + message.author.id, ch);
			await client.db.set("bal" + message.author.id, bal.toString());
		}
		message.reply({
			embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has successfully sold ${identified.item[1]} ${client.utils.comma(amt)} for :dollar: ${client.utils.comma(amtGained)}`),
		});
	},
};