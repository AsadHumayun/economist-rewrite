const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'block',
	aliases: ['block'],
	category: 'phn',
	description: "blocks a user, disallowing them to `~dial` you",
	async run (client, message, args) {
		if (!args.length) return message.reply(`${client.config.statics.defaults.emoji.err} You must specify a user who you wish to block!`)
		let usr;
		try {
			usr = await client.users.fetch(client.getID(args[0]))
		} catch (err) {
			usr = await client.users.fetch(args[0]).catch((x) => message.reply(`${client.config.statics.defaults.emoji.err} An invalid user was provided.`))
		};		
		if(!usr) return;
		await client.db.set(`isBlocked${message.author.id}${usr.id}`, true);
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has blocked ${usr.tag} from sending them any more text messages.`)
		})
	},
}