const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'rolemembers',
	aliases: ['rolemem', 'rolemembers'],
	description: 'View all the members of a specified role; can be either name mention or ID',
	category: 'ecn',
	async run(client, message, args) {
		if(!args.length) return message.reply("You need to like provide a role name/id")
		let roles = await client.db.get("cstmrl" + message.author.id) || "";
				roles = client.config.listToMatrix(roles.split(";"), 2);
		let spch = args.join(" ");
		let key = args[0].toLowerCase();
		let kw = roles.map((x) => x[0]);
		let role;
		if (!kw.includes(key)) {
			if (spch.startsWith('"') && (spch.endsWith('"'))) {
				const name = spch.slice(1, -1);
				let tst = message.guild.roles.cache.find((x) => x.name.toLowerCase() == name.toLowerCase()) || message.guild.roles.cache.find((x) => x.name.toLowerCase().startsWith(name));				
				if (!tst) return message.reply(`A role by the name "${name}" cannot be found.`);
				role = tst;
			} else {
				return message.reply("You do not seem to own a role by that keyword - `" + message.guild.prefix + "roles` to view a list of roles that you own.")
			}
		} else {
			role = roles.find((x) => x[0] == key);
			role = message.guild.roles.cache.get(role[1]);
			if (!role) return message.reply("Invalid role id: " + role[1])
		}
		if (!role) return message.reply("Can't seem to find that role.. try again!");
		var counter = 1;
		const members = role.members.map((x) => `#${counter++} ${x.user.tag} (${x.id})`).join('\n');
		if (members.length < 2048) {
			return message.reply({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setTitle("Members with the " + role.name + " role")
				.setDescription(members)
			});
		};
	message.author.send(members, { split: { char: "\n" } })
		.then((x) => message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`Successfully sent ${message.author.tag} a list of ${role.members.size} members who have the ${role.name} role`)
		}))
			.catch((x) => message.reply("You need to enable your DMs in order for me to send youa list of members who have this role."))
	},
};