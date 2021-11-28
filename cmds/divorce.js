const { MessageEmbed } = require('discord.js');

module.exports = {
	"name": "divorce",
	aliases: ['divorce', 'div'],
	description: "Divorce your spouse.",
	category: 'ecn',	
	async run(client, message, args) {
		let spouse = await client.db.get("spouse" + message.author.id);
		if (!spouse) return message.reply("You're not married to anyone yet! `" + message.guild.prefix + "spouse`");
		let author = await client.db.get("spouse" + spouse);
		let usr = await client.users.fetch(spouse);
		let tag = `${usr.username}#${usr.discriminator}`;

		await client.db.delete("spouse" + message.author.id);
		await client.db.delete("spouse" + spouse);

		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`:broken_heart: ${message.author.tag} has divorced ${tag} :sob:`)
		});
	},
};