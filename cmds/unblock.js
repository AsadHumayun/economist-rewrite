const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'unblock',
	aliases: ['unblock'],
	description: "unblocks a user, allowing them to `~dial` you",
	category: 'phn',
	async run (client, message, args) {
		if (!args.length) return message.reply(`${client.config.statics.defaults.emoji.err} You must specify a user who you wish to unblock!`)
		let usr;
		try {
			usr = await client.users.fetch(client.getID(args[0]))
		} catch (err) {
			usr = await client.users.fetch(args[0]).catch((x) => message.reply(`${client.config.statics.defaults.emoji.err} An invalid user was provided.`))
		};		
		if(!usr) return;
		await client.db.delete(`isBlocked${message.author.id}${usr.id}`);
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has unblocked ${usr.tag}! ${usr.tag} can now send them messages via their :iphone:`)
		})
	},
}