"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "ptransfer",
	aliases: ["ptransfer", "transferitm"],
	description: "Transfers one of your owned items to another user; 2 hours' cooldown",
	async run(client, message, args) {
		if (args.length < 2) return message.reply(`Please use the following format: \`${message.guild ? message.guild.prefix : client.const.prefix}transferitm <user> <item>\``);
		const user = await client.utils.fetchUser(args[0]).catch(() => {return;});
		if (!user) return message.reply("You must mention a user!");
		const data = await client.db.getUserData(user.id);
		const userCst = data.get("cst") ? data.get("cst").split(";") : [];
		let cst = message.author.data.get("cst") ? message.author.data.get("cst").split(";") : [];
		const item = args[1].toLowerCase();
		const res = client.utils.ditems.findIndex((i) => item.startsWith(i.split(";")[0]));
		if (res < 0) return message.reply(`The different types of ditems which you can transfer are ${client.utils.list(client.utils.ditems.map((i) => i.split(";")[1]))}`);

		const name = client.utils.ditems[res].split(";")[1];
		const role = client.utils.ditems[res].split(";")[2];
		const ss = await client.guilds.cache.get(client.const.supportServer).members.fetch(user.id).catch(() => {return;});
		const authorSS = await client.guilds.cache.get(client.const.supportServer).members.fetch(message.author.id).catch(() => {return;});

		if (!cst.includes(name)) return message.reply(`You don't currently possess a ${name.toUpperCase()} on this account, therefore you cannot transfer it to others`);
		if (userCst.includes(name)) return message.reply(`U:${user.tag} (${user.id}) already has ${name.toUpperCase()}.`);
		cst = cst.filter((e) => ![name].includes(e));
		userCst.push(name);
		await client.db.USERS.update({
			cst: cst.join(";"),
		}, {
			where: {
				id: message.author.id,
			},
		});
		await client.db.USERS.update({
			cst: userCst.join(";"),
		}, {
			where: {
				id: message.author.id,
			},
		});
		if (authorSS) authorSS.roles.remove(role).catch(() => {return;});
		if (ss) ss.roles.add(role).catch(() => {return;});

		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has successfully transferred "${name.toUpperCase()}" to U: ${user.tag} (${user.id})`),
			],
		});
	},
};