"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "rob",
	aliases: ["rob", "ripoff"],
	description: "Rob a user, stealing X amount of the User's balance",
	usage: "<user: UserResolvable>",
	async run(client, message, args) {
		const result = Math.floor(Math.random(1) * 10);
		const cooldown = message.author.data.get("rbc");
		const cd = client.utils.cooldown(message.createdTimestamp, cooldown * 60_000);
		if (cd) return message.reply(`You must wait another ${cd} before robbing someone again!`);
		if (!args.length) return message.reply("You must mention a user in order for this command to work!");
		const usr = await client.utils.fetchUser(args[0]).catch(() => {return;});
		if (!usr) return message.reply("You must mention a user in order for this command to work!");
		if (message.author.id == usr.id) return message.reply("You can't rob yourself!");
		const data = await client.db.getUserData(usr.id);
		const bal = client.utils.expand(data.get("bal"));
		if (bal < 1000n) return message.reply("That user is too poor to be robbed! Have some humanity. Rob someone richer!");
		const cst = message.author.data.get("cst") ? message.author.data.get("cst").split("") : [];
		if (cst.includes("dnr")) {
			return message.reply("You can't rob them :c");
		}
		const authorBal = client.utils.expand(message.author.data.get("bal") || 0n);
		if (authorBal < 1000n) return message.reply("You must have at least :dollar: 1,000 in your account before robbing from someone!");
		await client.db.USERS.update({
			// 3 hour cooldown (10800000ms = 3h)
			rbc: client.utils.parseCd(message.createdTimestamp, 10800000),
		}, {
			where: {
				id: message.author.id,
			},
		});
		// 25% chance the robber gets caught by the police :cry:
		if (result <= 10.00) {
			const stolen = BigInt(((bal * BigInt(Math.floor(Math.random() * 100))) / 2n).toString().split(".")[0]);
			await client.utils.updateBalance(message.author, stolen, message, { a: `robbed-U-${usr.tag}(${usr.id})` });
			await client.utils.updateBalance(usr, -stolen, message, { a: `robbed-by-U-${message.author.tag}(${message.author.id})` });
			message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag} has stolen :dollar: ${client.utils.digits(stolen)} from ${usr.tag}!`),
				],
			});
			client.utils.dm({
				userId: usr.id,
				message: {
					embeds: [
						new MessageEmbed()
							.setColor(client.const.colors.red)
							.setTitle("Uh Oh!")
							.setDescription(`${message.author.tag} has stolen :dollar: ${client.utils.comma(client.utils.noExponents(stolen))} from you!`),
					],
				},
			});
		}
		else {
			// user got caught by the police!
			await client.utils.stn({
				userId: message.author.id,
				minutes: 5n,
				stnb: "arrested",
			});
			await client.utils.updateBalance(message.author, -1000n, message, { r: "rob-penalty" });
			message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag} tried to rob ${usr.tag} but got caught and has been arrested for 5 minutes! They bribed the cops with :dollar: 1,000 to get out of jail.`),
				],
			});
		}
	},
};