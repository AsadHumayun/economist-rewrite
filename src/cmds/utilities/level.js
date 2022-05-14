"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "level",
	aliases: ["level", "xp", "lvl"],
	description: "View your or someone else's level & XP (only shows info from support server)",
	usage: "<user: ?UserResolvable>",
	async run(client, message, args) {
		if (!args.length) args = [message.author.id];
		const user = await client.utils.fetchUser(args[0]).catch(() => {return;});
		let data;
		if (user) {
			data = await client.db.getUserData(user.id);
		}
		else {
			data = message.author.data;
		}
		const xp = data.get("xp").split(";").map(client.utils.expand);
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					// "19893045890435&35435"
					// 198,930,458,904,350,000... (35431 digits)
					.setTitle(`${user.tag}'s Experience [${client.utils.digits(xp[0])}]`)
					.setDescription("Whenever you send a message in the support server, you gain a random number of XP between 15 and 35. To prevent spam, XP will only be added once every 60 seconds.")
					.addField("XP", `${client.utils.digits(xp[1])}/${client.utils.digits(xp[0] * 200n)}`, true)
					.addField("XP Until Level Up", `${client.utils.digits((xp[0] * 200n) - xp[1])}`, true),
			],
		});
	},
};