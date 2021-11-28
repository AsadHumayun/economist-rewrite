const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'number',
	aliases: ['number'],
	description: "Grab a user's number and dial them with $this.guild.prefixdial <number>",
	category: 'phn',
	async run(client, message, args) {
		let cst = await client.db.get("cst" + message.author.id) || "";
				cst = cst.split(";");		
		let fb = cst.includes("phoneb");
		if (!fb) return message.reply(`${client.config.statics.defaults.emoji.err} You don't own a ${client.config.emoji.phonebook} ! \`${message.guild.prefix}buy 3\``)

		if(!args.length) args = [message.author.id];
		let usr;
		try {
			usr = await client.users.fetch(client.getID(args[0]))
		} catch (err) {
			usr = await client.users.fetch(args[0]).catch((x) => message.reply(`${client.config.statics.defaults.emoji.err} An invalid user was provided.`))
		};		
		let num = await client.db.get('number' + usr.id);
		let count = await client.db.get('dialcount' + usr.id) || 0;
		if (!count) count = 0;
		if (!num) return message.reply(`${usr.tag} does not own a :iphone:. As a result, they do not have a phone number.`);
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(`${usr.tag}'s Phone`)
			.setDescription(`:iphone: Number - ${num}\n:telephone_receiver: Number of times dialed - ${message.author.com == 0 ? count : client.comma(count)}`)
		})	
	}
}
