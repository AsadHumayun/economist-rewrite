const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "give",
	aliases: ["give", "gv"],
	description: "add permissions to users.",
	category: "own",
	cst: "administrator132465798",
	async run(client, message, args) {
		if (args.length < 2) return message.reply(`You must follow the following format: \`${message.guild ? message.guild.prefix : client.const.prefix}give <user> <...upgrade>\``);
		const usr = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!usr) return message.reply(`Invalid user "${args[0]}"`, { allowedMentions: { parse: [] } });

		if (!isNaN(args[1])) {
			let bal = await client.db.get("bal" + usr.id) || "0";
			bal = Number(bal);
			const amt = Number(args[1]);
			bal += amt;
			await client.db.set("bal" + usr.id, bal);
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`:dollar: ${client.config.comma(amt)} have been added to ${usr.tag}'s account`),
				],
			});
		}

		const val = args.slice(1).join(" ");
		let cst = await client.db.get("cst" + usr.id);
		cst = cst ? cst.split(";") : [];
		const mem = await client.guilds.cache.get(client.config.statics.supportServer).members.fetch(usr.id).catch(() => {return;});
		const role = client.guilds.cache.get(client.config.statics.supportServer).roles.cache.find((f) => f.name.toLowerCase() == val.toLowerCase());
		if (role) {
			if (!mem) {
				// not gonna lie but I have no f****ing clue what this does.
				let incl = false;
				for (const f of cst) {
					if (incl == true) return;
					if (client.guilds.cache.get(client.config.statics.supportServer).roles.cache.get(f)) {
						if (f == val.toLowerCase()) incl = true;
					}
				}
				if (incl == false) cst.push(role.id);
			}
			else {
				mem.roles.add(role.id);
			}
		}
		cst.push(val);
		await client.db.set("cst" + usr.id, cst.join(";"));
		return message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${usr.tag} has received ${val}`),
			],
		});
	},
};