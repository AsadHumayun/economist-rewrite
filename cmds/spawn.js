const { MessageEmbed } = require('discord.js');

module.exports = {
	"name": "spawn",
	"aliases": ["spawn"],
	"description": "Spawns a briefcase in the current channel",
	"category": 'own',
	"cst": "spawn",
	async run(client, message, args) {
		let data = await client.db.get(`briefcase${message.channel.id}`);
		if (data) return message.reply(`${client.config.statics.defaults.emoji.err} There is already a briefcase in this channel! Steal it with \`${message.guild.prefix}steal\``);

		await client.db.set(`briefcase${message.channel.id}`, true);
		message.reply(`Someone just dropped their :briefcase: briefcase in this channel! Hurry up and steal it with \`${message.guild.prefix}steal\`!`);
	}
}