"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "clrs",
	category: "utl",
	aliases: [ "viewclrs", "clrs", "colors", "colours", "clr" ],
	description: "View someone's colour preferences",
	async run(client, message, args) {
		if (!args) args = [message.author.id];
		let usr = await client.config.fetchUser(args[0])
		// eslint-disable-next-line no-empty-function, no-unused-vars
			.catch(() => {return;});
		if (!usr) usr = message.author;
		// possibility that <usr> isn't registered into the database.
		const data = await client.db.getUserData(usr.id);
		return message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setTitle(`${usr.tag}'s Colour Preferences`)
					.setDescription(`Every time you use a command, each colour is cycled through sequentially. The last value is where the bot is currently at in your cycle. \n\n\`\`\`js\n${client.config.Inspect(data.get("clr").split(";"))}\`\`\``),
			],
		});
	},
};