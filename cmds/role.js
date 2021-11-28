const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'role',
	aliases: ['role'],
	category: 'ecn',
	description: "adds/removes a role from someone only if you own an assignable role :D",
	async run(client, message, args) {
		if (message.guild.id != client.config.statics.supportServer) return message.reply("This command only works in the support server as a result of how role information is manipulated.");
		if (args.length < 2) return message.reply("You must provide a valid role keyword followed by the target user!")
		let roles = await client.db.get('cgrl' + message.author.id);
		if (!roles) return message.reply(`${client.config.statics.defaults.emoji.err} You do not own any custom roles.`);

		roles = client.config.listToMatrix(roles.split(";"), 2);
		let key = args[0].toLowerCase();
		let kw = roles.map((x) => x[0]);
		if (!kw.includes(key)) {
			return message.reply("You don't seem to own a role with that keyword!\n\nYour owned roles' keywords are: " + kw.map(x => `\`${x}\``).join(', '));
		};

		let role = roles.find((x) => x[0] == key);
			role = message.guild.roles.cache.get(role[1]);
		let usr = await client.config.fetchUser(args[1]).catch((x) => {})
		if (!usr) return message.reply("You didn't specify a user??!!")

		let guildMember = message.guild.members.cache.get(usr.id);
		if (!guildMember) return message.reply(`${client.config.statics.defaults.emoji.err} ${usr.tag} is not a member of this server`);
		if (guildMember.roles.cache.has(role.id)) {
			await guildMember.roles.remove(role.id);
			return message.reply({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${usr.tag} has lost the ${role.name} role`)
			});
		};
	
		if (!guildMember.roles.cache.has(role.id)) {
			await guildMember.roles.add(role.id);
			return message.reply({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${usr.tag} has received the ${role.name} role`)
			});
		};
	},
};