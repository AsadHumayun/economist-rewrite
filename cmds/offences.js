"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "offences",
	aliases: [ "offences", "offenses", "ofncs" ],
	description: "View a user's offences (mod only)",
	category: "mod",
	cst: "tmod",
	async run(client, message, args) {
		let user = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!user) user = message.author;
		const userData = await client.db.getUserData(user.id);
		let ofncs = userData.get("ofncs") ? userData.get("ofncs").split(";").map(Number) : new Array(Object.keys(client.config.statics.defaults.ofncs).length).fill(0);
		if (user.bot) ofncs = ofncs.map(() => -1);
		if (message.content.toLowerCase().endsWith("-r")) return message.reply("```\n[" + ofncs.join(", ") + "]\n```");
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setTitle(`${user.tag}'s Offences [${ofncs.reduce((a, b) => a + b, 0)}]`)
					.setDescription(
						`
\`${message.guild.prefix}punish <user> <offence>\` to punish a user for an offence;
\`${message.guild.prefix}unpunish <user> <offence>\` to unpunish a user for an offence.

${Object.entries(client.config.statics.defaults.ofncs).map((ofnc, index) => `[${ofnc[0]}]: ${ofnc[1][0]} - ${ofncs[index]}`).join("\n")}
						`,
					),
			],
		});
	},
};