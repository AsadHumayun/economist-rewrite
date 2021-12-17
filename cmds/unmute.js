const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'unmute',
	aliases: ['unmute', 'un-mute'],
	description: 'unmutes a user.',
	category: 'mod',
	cst: "tmod",
	async run (client, message, args) {
		let usr = await client.config.fetchUser(args[0]).catch(() => {return;});
		if(!usr) return message.reply(`${client.config.statics.defaults.emoji.err} I can't seem to find that user...`);
		let member = message.guild.member(usr.id);
		if (!member) return message.reply(`${client.config.statics.defaults.emoji.err} The specified user is not a member of this server`);
		if (!member.roles.cache.has(client.config.statics.defaults.roles.muted)) {
			return message.reply(`${client.config.statics.defaults.emoji.err} ${member.user.tag} isn't muted... how are you gonna unmute them?`);
		};
		let dm = new MessageEmbed()
		.setColor(client.config.statics.defaults.colors.green)
		.setDescription(`Your mute has been removed in ${message.guild.name}`)
		.addField(`Moderator`, message.author.tag, true)
		.addField("Reason", args.slice(1).join(' ') || "No reason given", true)
		await member.roles.remove(client.config.statics.defaults.roles.muted);
		await message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${client.config.statics.defaults.emoji.tick} ${member.user.tag} has been unmuted and was sent the following message:`)
		})
		message.reply(dm);
		member.send(dm);
	}
}