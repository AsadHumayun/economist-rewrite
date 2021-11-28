const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'name',
	aliases: ['name'],
	description: 'Name your dragon.',
	cst: "supreme",
	category: 'pet',
	async run(client, message, args) {
		if (!message.author.cst.includes("dragon")) return message.reply("You must own a dragon in order for this command to work!");
		if (!args.length) return message.reply("You must specify a new name for your dragon!")
		let newName = args.join(' ');
		if(newName.length > 50) return message.reply("Your dragon's name may not exceed 50 characters in length.")
		await client.db.set('petname' + message.author.id, newName);
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has successfully renamed their dragon to ${newName}`)
		});
	},
};