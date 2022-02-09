"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "pbuy",
	aliases: ["pbuy"],
	description: "Purchase something and use up some of your XP",
	usage: "<ditem: string>",
	async run(client, message, args) {
		if (!args.length) return message.reply(`You must follow the format of \`${message.guild ? message.guild.prefix : client.const.prefix}pbuy <item>\` in order for this command to work!`);
		let xp = message.author.data.get("xp") ? message.author.data.get("xp").split(";").map(Number) : [1, 0];
		const lvl = xp[0];
		xp = xp[1];
		const cst = message.author.data.get("cst") ? message.author.data.get("cst").split(";") : [];
		const item = args[0].toLowerCase();
		const res = client.utils.ditems.findIndex((i) => item.startsWith(i.split(";")[0]));
		if (res < 0) return message.reply(`The different types of ditems that you can purchase are ${client.utils.list(client.utils.ditems.map((i) => i.split(";")[1]))}`);

		const name = client.utils.ditems[res].split(";")[1];
		if (cst.includes(name)) return message.reply(`You already have a \`${name}\` on this account.`);
		const role = client.utils.ditems[res].split(";")[2];
		const price = client.utils.ditems[res].split(";")[3];
		if (xp - price < 0) return message.reply(`You don't have enough XP to purchase the \`${name.toUpperCase()}\` permission! You are required to have a minimum of ${price} XP before purchasing this item; to view your current XP, type \`${message.guild ? message.guild.prefix : client.const.prefix}xp\``);
		const ss = client.guilds.cache.get(client.const.supportServer).members.cache.get(message.author.id);
		if (ss) ss.roles.add(role);
		cst.push(name);
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has successfully bought the ${name.toUpperCase()} permission!`),
			],
		});
		await client.db.USERS.update({
			xp: `${lvl};${xp - price}`,
			cst: cst.join(";"),
		}, {
			where: {
				id: message.author.id,
			},
		});
	},
};