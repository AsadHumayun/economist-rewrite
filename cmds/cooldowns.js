const { MessageEmbed } = require('discord.js');
const ms = require('ms')

module.exports = {
	name: 'cooldowns',
	aliases: ['cds', 'cooldowns', 'cd', 'coold'],
	cst: "supreme",
	category: 'utl',	
	async run(client, message, args) {
		let cds = [];
		for (cd of client.config.cds) {
			cd = cd.split(";");
			let cdd = (await client.db.get(cd[0] + message.author.id) || 0);
			let cdm = client.cooldown(message.createdTimestamp, cdd*client.config.exp, true);
			if (cdm) {
				cds.push(`${cd[1]}: ${cdm}`)
			};
		};
		let chc = await client.db.get("chillc" + message.author.id) || 1;
				chc = chc * client.config.exp;
		if (client.cooldown(message.createdTimestamp, chc, true)) cds.push("dose chillpill: " + client.cooldown(message.createdTimestamp, chc, true));
		if (cds.length < 1) return message.reply(`You have no active cooldowns; displayed cooldowns are [dose chillpill, ${client.config.cds.map((f) => f.split(";")[1]).join(", ")}]`);
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(`${message.author.tag}'s Cooldowns (${cds.length})`)
			.setDescription(cds.join("\n"))
		})
	},
};