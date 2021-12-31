const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "take",
	aliases: ["take"],
	description: "removes permissions from users.",
	category: "own",
	cst: "administrator132465798",
	async run(client, message, args) {
		if (args.length < 2) {
			return message.reply(`You must follow the following format: \`${message.guild.prefix}take <user> <...upgrade>\``);
		}
		const permission = args.slice(1).join(" ");
		const usr = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!usr) return message.reply("Try running the command again, this time actually ping a user llolololololl");
		const data = await client.db.getUserData(usr.id);
		if (!isNaN(args[1])) {
			let bal = data.get("bal") || 0;
			const amt = Number(args[1]);
			bal -= amt;
			await client.db.USERS.update({
				bal,
			}, {
				where: {
					id: usr.id,
				},
			});
			return message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`:dollar: ${client.config.comma(amt)} have been removed from ${usr.tag}'s account`),
				],
			});
		}

		let cst = data.get("cst") ? data.get("cst").split(";") : [];
		const mem = await client.guilds.cache.get(client.config.statics.supportServer).members.fetch(usr.id).catch(() => {return;});
		const role = client.guilds.cache.get(client.config.statics.supportServer).roles.cache.find((r) => r.name.toLowerCase() == permission.toLowerCase());
		if (mem && role) {
			mem.roles.remove(role.id).catch(() => {return;});
		}
		else if (role) {
			for (const f of cst) {
				if (client.guilds.cache.get(client.config.statics.supportServer).roles.cache.get(f) && (f == role.id)) {
					cst = cst.filter((x) => x != f);
				}
			}
		}
		cst = cst.filter(x => ![permission].includes(x)).join(";");
		await client.db.USERS.update({
			cst,
		}, {
			where: {
				id: usr.id,
			},
		});
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${usr.tag} has lost ${permission}`),
			],
		});
	},
};