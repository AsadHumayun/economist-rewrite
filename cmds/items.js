"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "items",
	aliases: ["i", "inventory", "stuff", "items"],
	category: "ecn",
	description: "See what items another user has",
	disabled: true,
	async run(client, message, args) {
		let user = await client.utils.fetchUser(args[0] || message.author.id);
		if (!user) user = message.author;
		let f = await client.db.get("fsh" + user.id) || "0;0;0;0;0;0";
		f = f.split(";");
		const cp = await client.db.get(`chillpills${user.id}`) || "0";

		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setTitle(`${user.tag}'s Items`)
					.setDescription(`\`${message.guild ? message.guild.prefix : client.const.prefix}fish\` to earn some fish`)
					.addField(
						"Fish",
						`
:dolphin: Dolphins - ${client.utils.comma(f[0])}
:shark: Sharks - ${client.utils.comma(f[1])}
:blowfish: Blowfish - ${client.utils.comma(f[2])}
:tropical_fish: Tropical Fish - ${client.utils.comma(f[3])}
:fish: Fish - ${client.utils.comma(f[4])}
`, true,
					)
					.addField("Other", `
${client.const.emoji.chill} Chill Pills - ${client.utils.comma(cp)}

		`, true,
					),
			],
		});
	},
};