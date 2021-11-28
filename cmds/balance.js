const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'balance',
	category: 'ecn',	
	aliases: ['balance', 'bal', 'money'],
	description: "Check someone's balance, see how much money they have",
	usage: '<User(id | @Mention)>',
	async run(client, message, args) {
		let usr = await client.config.fetchUser(args[0]).catch((x) => {});
		if (!usr) usr = message.author;
		const bal = await client.db.get('bal' + usr.id) || "0";
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${usr.tag}'s account contains :dollar: ${client.digits(bal)}`)
		});
	},
};