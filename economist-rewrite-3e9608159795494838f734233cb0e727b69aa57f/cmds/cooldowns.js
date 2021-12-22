const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "cooldowns",
	aliases: ["cds", "cooldowns", "cd", "coold"],
	cst: "supreme",
	cstMessage: "You're not prestigious enough to use this command! (requires Supreme)",
	category: "utl",
	async run(client, message) {
		const cds = [];
		for (let cd of client.config.statics.defaults.cds) {
			cd = cd.split(";");
			const cdd = (await client.db.get(cd[0] + message.author.id) || 0);
			const cdm = client.config.cooldown(message.createdTimestamp, cdd * 60_000, true);
			if (cdm) {
				cds.push(`${cd[1]}: ${cdm}`);
			}
		}
		if (cds.length < 1) return message.reply(`You have no active cooldowns; displayed cooldowns are [dose chillpill, ${client.config.statics.defaults.cds.map((f) => f.split(";")[1]).join(", ")}]`);
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setTitle(`${message.author.tag}'s Cooldowns (${cds.length})`)
					.setDescription(cds.join("\n")),
			],
		});
	},
};