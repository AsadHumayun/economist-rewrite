const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'addrole',
	aliases: ['addrole', 'addarole'],
	description: 'Give a user an assignable role; you must supply its ID since it will add a set role to them as-is... kinda hard to explain',
	category: 'own',
	cst: "adr",
	async run(client, message, args) {
		if (args.length < 3) return message.reply({ content: "Format: `" + message.guild.prefix + "addarole <user> <id> <kw>`" });
		let user = await client.config.fetchUser(args[0]).catch((x) => {});
		if (!user) {
			return message.reply({ content: "User not found" });
		};
		let id = message.guild.roles.cache.find((x) => x.id == args[1]);
		if (!id) return message.reply({ content: 'That role was not found >:(' });
		let kw = args[2].toLowerCase();
		let roles = await client.db.get("cgrl" + user.id);
			roles = roles ? roles.split(";") : [];
		roles.push(`${kw};${id.id}`);
		await client.db.set("cgrl" + user.id, roles.join(";"));
		message.reply({
			embeds: [new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`Successfully given cgrl for [${id.name}] to ${user.tag}`)
			]});
	},
};