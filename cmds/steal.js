const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'steal',
	description: 'steal a briefcase',
	category: 'eco',
	aliases: ['steal'],
	async run(client, message, args) {
		let _ = await client.db.get("briefcase" + message.channel.id);
		if (!_) return message.reply("There are no briefcases to steal right now...");

		await client.db.delete(`briefcase${message.channel.id}`);
		let oldbal = await client.db.get(`bal${message.author.id}`) || 0;
		let amt = Math.floor(
			Math.random() * 1000
		);
		await client.db.set(`bal${message.author.id}`, oldbal + amt);
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has stolen ${client.users.cache.filter(x => x.id != message.author.id).random().tag}'s briefcase and found :dollar: ${client.comma(amt)}`)
		})
	}
};