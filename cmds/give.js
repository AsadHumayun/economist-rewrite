const Discord = require('discord.js');

module.exports = {
	name: 'give',
	aliases: ['give', 'gv'],
	description: 'add permissions to users.',
	category: 'own',
	cst: "administrator132465798",
	async run(client, message, args) {
		if (args.length < 2) {
			return message.reply(`You must follow the following format: \`${message.guild.prefix}give <user> <...upgrade>\``);
		};
		const usr = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!usr) return message.reply("Try running the command again, this time actually ping a user llolololololl");

		if (!isNaN(args[1])) {
			let bal = await client.db.get("bal" + usr.id) || "0";
					bal = Number(bal);
			let amt = Number(args[1]);
			bal += amt;
			await client.db.set("bal" + usr.id, bal);
			return message.reply({
				embed: new Discord.MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`:dollar: ${client.config.comma(amt)} have been added to ${usr.tag}'s account`)					
			});			
		};

		let val = args.slice(1).join(" ");
		let cst = await client.db.get("cst" + usr.id);
				cst = cst ? cst.split(";") : [];
		const mem = await client.guilds.cache.get(client.config.statics.supportServer).members.fetch(usr.id).catch((err) => {});
		let role = client.guilds.cache.get(client.config.statics.supportServer).roles.cache.find((f) => f.name.toLowerCase() == val.toLowerCase());
		if (role) {
			if (!mem) {
				let incl = false;
				for (f of cst) {
					if (incl == true) return;
					if (client.guilds.cache.get(client.config.statics.supportServer).roles.cache.get(f)) {
						if (f == val.toLowerCase()) incl = true;
					};
				};
				if (incl == false) cst.push(role.id);
			} else {
				mem.roles.add(role.id);
			};
		};
		cst.push(val);
		await client.db.set("cst" + usr.id, cst.join(";"))
		return message.reply({
			embed: new Discord.MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${usr.tag} has received ${val}`)
		});
	},
};