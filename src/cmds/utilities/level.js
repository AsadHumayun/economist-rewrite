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
		const xp = data.get("xp").split(";").map(Number);
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setTitle(`${user.tag}'s Experience [${xp[0]}]`)
					.setDescription("Whenever you send a message in the support server, you gain a random number of XP between 15 and 35. To prevent spam, XP will only be added once every 60 seconds.")
					.addField("XP", `${xp[1]}/${xp[0] * 200}`, true)
					.addField("XP Until Level Up", `${(xp[0] * 200) - xp[1]}`, true),
			],
		});
	},
};