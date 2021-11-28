const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'unstun',
	aliases: ['unstun', 'un-stun'],
	cst: "administrator132465798",
	category: 'own',
	description: 'unstuns a user, allowing them to use commands',
	async run(client, message, args) {
		if(!args.length) return message.reply("You must specify the user to unstun!");
		let usr;
		try {
			usr = await client.users.fetch(client.getID(args[0]))
		} catch (err) {
			usr = await client.users.fetch(args[0]).catch((x) => message.reply('invalid user '))
		};
		if(!usr) return;
		let Data = await client.db.get('stn' + usr.id);
		if (!Data) return message.reply(`${usr.tag} is not stunned`)
		await client.db.delete('stn' + usr.id);
		await client.db.delete("dns" + usr.id);
		await client.db.delete("stnb" + usr.id);
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`Successfully unstunned ${usr.tag}`)
		})
	} 
}