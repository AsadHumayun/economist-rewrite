"use strict";
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "dragonalias",
	aliases: ["dragonalias"],
	category: "pet",
	cst: "dragon",
	description: "Choose a dragon alias to be displayed on your dragon!",
	async run(client, message, args) {
		let hasAliases = [];
		const cst = message.author.data.get("cst") ? message.author.data.get("cst").split(";") : [];
		const dragAliases = Object.keys(require("../petaliases.json")).map((k) => k.toLowerCase());
		hasAliases = dragAliases.filter((alias) => cst.includes(alias));
		hasAliases.push("default");
		let currAlias = message.author.data.get("crls" + message.author.id).toLowerCase();
		if (!dragAliases.includes(currAlias)) {
			currAlias = "default";
		}
		// user didn't give any args, so show them their available dragon aliases.
		if (!args.length) {
			return message.reply({
				embeds: [
					new MessageEmbed()
						.setTimestamp()
						.setColor(message.author.color)
						.setTitle(`${message.author.tag}'s Dragon Aliases [${hasAliases.length}]`)
						.setDescription(`Note: aliases are indexed via the order in which they are identified by the bot. Hence these values are not likely to remain static.\n\n\`\`\`\n${hasAliases.map((e) => `    ${hasAliases.indexOf(e)}: "${e}"${e.toLowerCase() == currAlias.toLowerCase() ? " [CURRENTLY SELECTED]" : ""}`).join(",\n")}\n\`\`\``),
				],
			});
		}
		else {
			// user has given args; allow them to choose/select an alias.
			if (isNaN(args[0])) return message.reply(`Invalid index "${args[0]}"; valid options are [${hasAliases.map((a) => hasAliases.indexOf(a)).join(", ")}]`);
			const id = Number(args[0]);
			const alias = hasAliases[id];
			await client.db.USERS.update({
				crls: alias,
			}, {
				where: {
					id: message.author.id,
				},
			});
			message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`Selected "${alias}" as preferred dragon alias.`),
				],
			});
		}
	},
};