"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "addrole",
	aliases: ["addrole", "addarole"],
	description: "Give a user an assignable role; you must supply its ID since it will add a set role to them as-is... kinda hard to explain",
	usage: "<user: UserResolvable> <Role ID: string> <role keyword: string>",
	ssOnly: true,
	cst: "adr",
	async run(client, message, args) {
		if (args.length < 3) return message.reply({ content: "Format: `" + message.guild ? message.guild.prefix : client.const.prefix + "addarole <user> <id> <kw>`" });
		const user = await client.utils.fetchUser(args[0]).catch(() => {return;});
		if (!user) {
			return message.reply({ content: "User not found" });
		}
		const id = message.guild.roles.cache.find((x) => x.id == args[1]);
		if (!id) return message.reply({ content: "That role was not found >:(" });
		const kw = args[2].toLowerCase();
		const data = await client.db.getUserData(user.id);
		let roles = data.get("cstmrl");
		roles = roles ? roles.split(";") : [];
		roles.push(`${kw};${id.id}`);
		await client.db.USERS.update({
			cstmrl: roles.join(";"),
		}, {
			where: {
				id: user.id,
			},
		});
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`Successfully given cstmrl for [${id.name}] to ${user.tag}`),
			],
		});
	},
};