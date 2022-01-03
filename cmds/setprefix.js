"use strict";
const { Util } = require("discord.js");

module.exports = {
	name: "setprefix",
	aliases: ["setprefix", "forceprefix"],
	category: "btsf",
	cst: "administrator132465798",
	description: "This command allows bot staff to change the prefix for your server in case you've forgotten it or have trouble resetting it",
	async run(client, message, args) {
		if (args.length < 1) return message.reply("You must specify the ID of the guild whose prefix you wish to change.");
		const guildid = args[0].toLowerCase();
		const guild = client.guilds.cache.get(guildid);
		if (!guild) return message.reply("A guild by that ID was not found! Please check the ID and try again.");

		if (args.length < 2) return message.reply("You must also specify a new prefix!");
		const prefix = args[1].toLowerCase();
		if (prefix.length > 3 || !prefix) return message.reply("The prefix may not be longer than 3 characters in length");
		try {
			await client.db.GUILDS.update({
				prefix,
			}, {
				where: {
					id: guildid,
				},
			});
			message.reply(`Successfully set prefix for guild [**${Util.escapeMarkdown(client.guilds.cache.get(guildid).name || "<UNKNOWN GUILD>")}**] as "${prefix.toLowerCase()}"`);
			client.channels.cache.get(client.config.statics.defaults.channels.pfx).send(`<${message.author.tag} (${message.author.id})>: [${message.guild.name} (${message.guild.id})]: ${message.content}`);
		}
		catch (e) {
			message.reply(`Error when updating prefix for ${guildid}: \`${e}\``);
		}
	},
};