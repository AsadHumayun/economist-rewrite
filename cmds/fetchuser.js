"use strict";
import { MessageEmbed } from "discord.js";
import { inspect } from "util";

export default {
	name: "fetchuser",
	aliases: ["fetchuser", "fetch-user", "fu"],
	category: "own",
	cst: "administrator132465798",
	description: "fetches a user (as partial)",
	usage: "fetchuser <id>",
	async run(client, message, args) {
		if (!args.length) return message.reply(`${client.const.emoji.err} You must mention a valid user in order for this command to work!`);
		const msg = await message.reply("Fetching user...");
		const user = await client.utils.fetchUser(args[0]).catch(() => {return;});
		if (!user) return msg.edit(`${client.const.emoji.err} I can't find that user.`);
		const data = inspect(user, { depth: 10 });
		msg.edit({
			content: null,
			embeds: [
				new MessageEmbed()
					.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
					.setColor(message.author.color)
					.setDescription("```js\n" + data + "\n```")
					.setFooter(`in ${Date.now() - msg.createdTimestamp} MS`),
			],
		});
	},
};