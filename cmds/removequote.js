"use strict";
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "removequote",
	aliases: ["removequote", "rq"],
	description: "Removes a quotation from your collection of quotes.",
	cst: "qts",
	async run(client, message, args) {
		let qts = message.author.data.get("qts");
		if (!qts) return message.reply("You don't have any quotes!");
		const indx = parseInt(args[0]);
		if (isNaN(indx) || indx < 0) return message.reply("You must enter a positive whole number");
		qts = qts.split(";");
		if (!qts[indx - 1]) return message.reply(`No quotation with index ${indx} was found. Look in \`${message.guild.prefix}quotes\` for a list of your quotations, which have an index next to them in brackets.`);
		const rq = qts[indx - 1];
		qts = qts.filter((value, index) => indx - 1 != index);
		await client.db.USERS.update({
			qts: qts.join(";"),
			pq: null,
		}, {
			where: {
				id: message.author.id,
			},
		});
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`Successfully removed quote "${rq}"`),
			],
		});
	},
};