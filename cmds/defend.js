const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "defend",
	aliases: [ "protect", "defend" ],
	category: "pet",
	description: "Toggle your dragon's protection — whether or not it will defend you when someone attempts to attack you.",
	async run(client, message) {
		// "args" weren't passed through here because they're not used, means memory isn't wasted on that var, makking this more efficient.
		let p = await client.db.get("pet" + message.author.id);
		if (!p) return message.reply("You must have a dragon in order for it to defend you! tame one by using `" + message.guild.prefix + "tame`");
		p = p.split(";");
		const dragonAlias = await client.config.getDragonAlias(message.author.id, client);
		let cst = await client.db.get("cst" + message.author.id) || "";
		cst = cst ? cst.split(";") : [];
		if (Number(p[1]) < 200) return message.reply("Your " + dragonAlias[0] + " must have at least " + dragonAlias[1][0] + " 200 in order to defend you from attackers.");
		if (!cst.includes("dfnd")) {
			cst.push("dfnd");
			await client.db.set("cst" + message.author.id, cst.join(";"));
			message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag}'s ${cst.includes("maxdragon888") ? "entirely maxed out" : ""} ${dragonAlias[0]} will now defend them from attackers.`),
				],
			});
		}
		else {
			cst = cst.filter((x) => !["dfnd"].includes(x));
			await client.db.set("cst" + message.author.id, cst.join(";"));
			message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag}'s ${cst.includes("maxdragon888") ? "entirely maxed out" : ""} ${dragonAlias[0]} will no longer defend them from attackers.`),
				],
			});
		}
	},
};