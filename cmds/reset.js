const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'reset',
	aliases: ['reset'],
	description: "Resets the entire bot (not a jk)",
	category: 'own',
	cst: "administrator132465798",
	async run(client, message, args) {
		if (message.author.id != client.config.owner) {
			return message.reply("You don't have permission to use this command!")
		};
		await client.db.clear();
			message.reply({
				embed: new MessageEmbed()
				.setDescription("Successfully wiped the entire database")
				.setColor('#da0000')
			});
	},
};