"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "ditems",
	aliases: ["dperms", "ditems"],
	description: "Shows your currently active special/donor permissions",
	usage: "<user: ?UserResolvable>",
	async run(client, message, args) {
		if (!args.length) args = [message.author.id];
		let user = await client.utils.fetchUser(args[0]).catch(() => {return;});
		if (!user) user = message.author;
		const data = await client.db.getUserData(user.id);
		const cst = data.get("cst") ? data.get("cst").split(";") : [];

		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setTitle(`${user.tag}'s Donor Ranks`)
					.setDescription(
						`
					\`${message.guild ? message.guild.prefix : client.const.prefix}ptransfer <user> <item>\` to transfer an item to another account

					\`\`\`\n${client.utils.Inspect(cst.filter((x) => client.utils.ditems.map((i) => i.split(";")[1]).includes(x)))}\n\`\`\`
					`,
					),
			],
		});
	},
};