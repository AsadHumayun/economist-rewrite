const { MessageEmbed } = require('discord.js');

module.exports = {
	"name": "ban",
	"aliases": ["ban"],
	"description": "Bans a user from the current guild.",
	"category": "mod",
	"cst": "moderator",
	async run(client, message, args) {
		if (args.length < 1) return message.reply("You must provide a `user` resolvable for your ban.")
		let user = await client.config.fetchUser(args[0]).catch((x) => {});
		if (!user) return message.reply(`${client.config.statics.defaults.emoji.err} You have provided an invalid user!`);
		let cst = await client.db.get("cst" + user.id) || "";
		if (cst.split(";").includes("moderator")) return message.reply("Moderators cannot ban each other. (`<User>` possesses `moderator` CST.)")
		var reason = args.slice(1).join(' ');
		if (!reason) reason = "<UNKNOWN REASON>"
		const Notification = new MessageEmbed()
		.setColor(client.config.colors['red'])
		.setDescription(`You have received a permanent ban from ${message.guild.name}. Note that your ban might be lifted soon—to appeal for an unban (or check your remaining ban length), please PM ${client.users.cache.get(client.config.owner).tag}. Additionally, if you think this is a mistake or you were wrognly punished, please contact ${client.users.cache.get(client.config.owner).tag}`)
		.addField("Moderator", message.author.tag)
		.addField("Reason", reason)

		const msgs = [`${client.config.statics.defaults.emoji.tick} ${user.tag} was given a permanent ban for "${reason}"; they have been sent the following message:`];

		var GuildMember = message.guild.members.cache.get(user.id);
		
		if (!GuildMember) {
			await message.guild.members.ban(user.id, { reason: `Banned by ${message.author.tag} (${message.author.id}); reason=${reason}` })
			message.reply({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(msgs[0])
			});
			message.reply({ embed: Notification });
		} else {
		if (GuildMember.hasPermission('BAN_MEMBERS')) return message.reply(`You're not allowed to ban a moderator!`)
		GuildMember
			.send({ embed: Notification })
				.catch((x) => {});
		GuildMember.ban(user.id, {reason: `Banned by ${message.author.tag} (${message.author.id}); reason="${reason}"`});
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(msgs[0])
		});
		message.reply({ embed: Notification });
		};
	},
};
