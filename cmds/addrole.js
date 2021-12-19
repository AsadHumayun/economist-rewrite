const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "addrole",
	aliases: ["addrole", "addarole"],
	description: "Give a user an assignable role; you must supply its ID since it will add a set role to them as-is... kinda hard to explain",
	category: "own",
	cst: "adr",
	async run(client, message, args) {
		if (args.length < 3) return message.reply({ content: "Format: `" + message.guild.prefix + "addarole <user> <id> <kw>`" });
		const user = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!user) {
			return message.reply({ content: "User not found" });
		}
		const id = message.guild.roles.cache.find((x) => x.id == args[1]);
		if (!id) return message.reply({ content: "That role was not found >:(" });
		const kw = args[2].toLowerCase();
		const data = await client.db.getUserData(user.id);
		let roles = data.get("cgrl");
		roles = roles ? roles.split(";") : [];
		roles.push(`${kw};${id.id}`);
		await client.db.USERS.update({
			cgrl: roles.join(";"),
		}, {
			where: {
				id: user.id,
			},
		});
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`Successfully given cgrl for [${id.name}] to ${user.tag}`),
			],
		});
	},
};