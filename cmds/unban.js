const { MessageEmbed } = require('discord.js');

module.exports = {
	"name": "unban",
	"aliases": ["unban"],
	"description": "unbans a user from the current guild.",
	"category": "mod",
	cst: "moderator",
	async run(client, message, args) {
		if (!message.member.roles.cache.has(client.config.statics.defaults.roles.mod.normal)) return message.reply("You must have the Moderator role in order to use this command. Trial Mods do not have permission to use this command, either.");

		if (!args.length) return message.reply("You must follow the format of `" + message.guild.prefix + "unban <user> [reason]`");
		let user = await client.config.fetchUser(args[0]).catch((x) => {});
		if (!user) return message.reply(`${client.config.statics.defaults.emoji.err} You have provided an invalid user!`);
		var reason = args.slice(1).join(' ') || "No reason given";
		const Notification = new MessageEmbed()
		.setColor(client.config.colors['green'])
		.setDescription(`You have been unbanned from ${message.guild.name}. Please conduct yourself appropriately such that you do not get banned again. [Support Server Invite](${client.config.ssInvite})`)
		.addField("Moderator", message.author.tag)
		.addField("Reason", reason)

		const msgs = [`${client.config.statics.defaults.emoji.tick} ${user.tag}'s ban has been removed because of "${reason || "<UNKNOWN REASON>"}"; they have been sent the following message:`];
		await message.guild.members.unban(user.id);
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(msgs[0])
		})
		message.reply({ embed: Notification });
		client.users.cache.get(user.id)
			.send({ embed: Notification })
				.catch((x) => {});
	}
};