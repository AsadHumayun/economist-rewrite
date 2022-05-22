"use strict";
import { MessageEmbed } from "discord.js";
import { Op } from "sequelize";

export default {
	name: "purge",
	aliases: ["purge"],
	usage: "<cst: string>",
	description: "Removes a CST value from every user. This is done db-side, so even if a user shares no mutual servers with the bot, their data will still be edited.",
	cst: "administrator132465798",
	async run(client, message, args) {
		if (!args.length || !args.join(" ").replace(/;+/g, "").trim().length) return message.reply("You must specify a CST to purge in order for this command to work!\nNote that semicolons will be removed from your purge argument.");
		const arg = args.join(" ").replace(/;+/g, "").trim();
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`Purging ${arg}...`),
			],
		});
		// source: https://sequelize.org/master/manual/model-querying-basics.html
		// above link used to figure out how I'm supposed to use this (not very experienced with Sequelize, don't judge). The actual code is written by myself.
		client.db.USERS.findAndCountAll({ attributes: ["id", "cst"], where: { cst: { [Op.like]: `%${arg}%` } } }).then((data) => {
			let updated = 0;
			for (const value of data.rows) {
				if (data.rows[data.rows.indexOf(value)].dataValues.cst.split(";").includes(arg)) {
					data.rows[data.rows.indexOf(value)].dataValues.cst = data.rows[data.rows.indexOf(value)].dataValues.cst.split(";").filter((f) => f.toLowerCase() != arg.toLowerCase()).join(";");
					updated++;
				}
			}
			Promise.all(
				data.rows.map(row => {
					client.db.USERS.update({
						cst: row.dataValues.cst,
					}, {
						where: {
							id: row.dataValues.id,
						},
					});
				}),
			);
			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`Updated ${data.count} accounts`),
				],
			});
		});
	},
};