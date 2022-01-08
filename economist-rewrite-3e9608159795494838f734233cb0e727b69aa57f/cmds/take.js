const Discord = require('discord.js');

module.exports = {
	name: 'take',
	aliases: ['take'],
	description: 'removes permissions from users.',
	category: 'own',
	cst: "administrator132465798",
	async run(client, message, args) {
		if (args.length < 2) {
			return message.reply(`You must follow the following format: \`${message.guild ? message.guild.prefix : client.const.prefix}take <user> <...upgrade>\``);
		};
		const permission = args.slice(1).join(' ');
		const usr = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!usr) return message.reply("Try running the command again, this time actually ping a user llolololololl");

		if (!isNaN(args[1])) {
			let bal = await client.db.get("bal" + usr.id) || "0";
				bal = Number(bal);
			let amt = Number(args[1]);
				bal -= amt;
			await client.db.set("bal" + usr.id, bal);
			return message.reply({
				embed: new Discord.MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`:dollar: ${client.config.comma(amt)} have been removed from ${usr.tag}'s account`)					
			});			
		};

		let cst = await client.db.get("cst" + usr.id);
			cst = cst ? cst.split(";") : [];
		const mem = await client.guilds.cache.get(client.config.statics.supportServer).members.fetch(usr.id).catch(() => {return;});
		let role = client.guilds.cache.get(client.config.statics.supportServer).roles.cache.find((r) => r.name.toLowerCase() == permission.toLowerCase());
		if (mem && (role)) {
			mem.roles.remove(role.id);
		} else if (role) {
			for (f of cst) {
				if (client.guilds.cache.get(client.config.statics.supportServer).roles.cache.get(f) && (f == role.id)) {
					cst = cst.filter((x) => x != f);
				};
			};
		};
		cst = cst.filter(x => ![permission].includes(x)).join(";");
		await client.db.set("cst" + usr.id, cst);
		return message.reply({
			embed: new Discord.MessageEmbed()
			.setDescription(`${usr.tag} has lost ${permission}`)
			.setColor(message.author.color)
		});
	},
};