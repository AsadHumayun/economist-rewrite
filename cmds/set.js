"use strict";
﻿const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "set",
	aliases: ["set", "s"],
	description: "sets a value with key `<key>` and value `<value>` in the database",
	usage: "<key> <value>",
	cst: "administrator132465798",
	category: "own",
	async run(client, message, args) {
		if (args.length < 3) return message.reply("You must specify a user, key and value.");
		const user = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!user) return message.reply("You must specify a user for this command to work!");
		await client.db.getUserData(user.id);
		const cst = message.author.data.get("cst") ? message.author.data.get("cst").split(";") : [];
		const key = args[1];
		let val = args.slice(2).join(" ");
		if (val.startsWith("\"") && (val.endsWith("\""))) {
			val = String(val).slice(1, -1);
		}
		else {
			if (!isNaN(val)) val = Number(val);
			if (val.toString().toLowerCase() == "true") val = true;
			if (val.toString().toLowerCase() == "false") val = false;
			try {
				val = JSON.parse(val);
			}
			catch (e) {
				// eslint-disable-line no-empty
			}
		}
		try {
			await client.db.USERS.update({
				[key]: val,
			}, {
				where: {
					id: user.id,
				},
			}).then((res) => {
				if (res[0] == 0) {
					return message.reply({ content: "Database value was not updated (most likely, no column by that name exists)", allowedMentions: { parse: [], repliedUser: true } });
				}
				else if (!cst.includes("tst")) {
					message.reply({
						embeds: [
							new MessageEmbed()
								.setColor(message.author.color)
								.setDescription(`Successfully set ${key} ${user.id} as ${val}`),
						],
					}).catch((x) => {
						message.reply("Encountered error: `" + x + "`. Resending message...");
						message.reply(`Successfully set ${key} ${user.id} <value too large to display>`);
					});
				}
				else {
					message.reply(`Successfully set ${key} ${user.id} as ${client.config.trim(val, 1900)}`);
				}
			});
		}
		catch (e) {
			message.reply(`:slight_frown: An error occurred!\n\`${e}\``);
		}
	},
};