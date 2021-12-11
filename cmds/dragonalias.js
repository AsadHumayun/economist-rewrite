const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "dragonalias",
	aliases: ["dragonalias"],
	category: "pet",
	cst: "dragon",
	description: "Choose a dragon alias to be displayed on your dragon!",
	async run(client, message, args) {
		let none, hasAliases = [];
		let cst = await client.db.get("cst" + message.author.id) || "";
		cst = cst ? cst.split(";") : [];
		if (cst.length == 0) none = true;
		const dragAliases = Object.keys(require("../petaliases.json")).map((k) => k.toLowerCase());
		hasAliases = dragAliases.filter((alias) => cst.includes(alias));
		hasAliases.push("default");
		if (hasAliases.length == 0) none = true;
		let currAlias = (await client.db.get("curralias" + message.author.id) || "_").toLowerCase();
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
			if (isNaN(args[0])) return message.reply(`Invalid index "${args[0]}"; valid options are [${hasAliases.map((a) => hasAliases.indexOf(a)).join(", ")}]`)
			const id = Number(args[0]);
			const alias = hasAliases[id];
			await client.db.set("curralias" + message.author.id, alias);
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