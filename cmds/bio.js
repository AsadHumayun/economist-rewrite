const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'bio',
	aliases: ['bio', 'setbio'],
	category: 'utl',	
	description: 'Edits your `bio` (Shwon in the `profile` command)',
	async run(client, message, args) {
		let str = args.join(' ');
		str = str.slice(0, 1200)

		await client.db.set('bio' + message.author.id, str)
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has updated their profile bio!`)
		})
	}
}