const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'invite',
	aliases: ['invite', 'inv'],
	description: "View the bot's invite link to add it to other servers",
	category: 'utl',
	async run(client, message, ...args) {
		message.reply({
			embed: new MessageEmbed()
			.setColor(message['author']['color'])
			.setDescription(`[Click here to invite ${client.user.username} to one of your servers!](${client.config.inv})`)
		})
	} 
}