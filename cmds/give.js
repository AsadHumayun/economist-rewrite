"use strict";
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "give",
	aliases: ["give", "gv"],
	description: "add permissions to users.",
	category: "own",
	cst: "administrator132465798",
	async run(client, message, args) {
		if (args.length < 2) return message.reply(`You must follow the following format: \`${message.guild.prefix}give <user> <...upgrade>\``);
		const usr = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!usr) return message.reply(`Invalid user "${args[0]}"`, { allowedMentions: { parse: [] } });
		const data = await client.db.getUserData(usr.id);

		if (!isNaN(args[1])) {
			let bal = data.get("bal") || 0;
			const amt = Number(args[1]);
			bal += amt;
			await client.db.USERS.update({
				bal,
			}, {
				where: {
					id: usr.id,
				},
			});
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`:dollar: ${client.config.comma(client.config.noExponents(amt))} have been added to ${usr.tag}'s account`),
				],
			});
		}

		const val = args.slice(1).join(" ");
		const cst = data.get("cst") ? data.get("cst").split(";") : [];
		const mem = await client.guilds.cache.get(client.config.statics.supportServer).members.fetch(usr.id).catch(() => {return;});
		const role = client.guilds.cache.get(client.config.statics.supportServer).roles.cache.find((f) => f.name.toLowerCase() == val.toLowerCase());
		if (role) {
			if (!mem) {
				// If user not in support server, append role ID to their cst therefore meaning next time they join they'll get auto-added to that role.
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
				// the guildMemberUpdate event will handle role persists when roles are added to/remove from members.
				mem.roles.add(role.id);
			}
		}
		cst.push(val);
		await client.db.USERS.update({
			cst: cst.join(";"),
		}, {
			where: {
				id: usr.id,
			},
		});
		return message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${usr.tag} has received ${val}`),
			],
		});
	},
};