"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "clrs",
	aliases: [ "viewclrs", "clrs", "colors", "colours", "clr" ],
	description: "View someone's colour preferences",
	usage: "<user: ?UserResolvable>",
	async run(client, message, args) {
		if (!args) args = [message.author.id];
		let usr = await client.utils.fetchUser(args[0])
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
					.setDescription(`Every time you use a command, each colour is cycled through sequentially. The last value is where the bot is currently at in your cycle. \n\n\`\`\`js\n${data.get("cst")?.split(";").includes("rc") ? `You currently have random colours enabled. To disable this, you can sell the random colour preference shop item and gain your money back. Use ${message.guild?.prefix || client.const.prefix}help sell for more information.` : client.utils.Inspect(data.get("clr").split(";"))}\`\`\``),
			],
		});
	},
};