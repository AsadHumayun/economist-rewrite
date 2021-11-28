let { MessageEmbed } = require("discord.js");

module.exports = {
	name: "blacklist",
	aliases: ['bl', "botban"],
	description: "blacklist a user from the bot.",
	usage: "blacklist <user>",
	category: 'own',
	cst: "blacklist",
	async run(client, message, args) {
		if (args.length < 1) return message.reply("You must input a UserResolvable argument.")
		const user = await client.config.fetchUser(args[0]).catch((x) => {});
		const banned = await client.db.get("blacklist" + user.id);
		if (!user) return message.reply("Please provide a valid ID or mention a user in the server!");
		let _perms = await client.db.get("perms" + user.id) || "0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0";
				_perms = _perms.split(";");
		if (_perms[0] == "1") return message.reply("You may not blacklist this user!");

		const msg = `${client.config.statics.defaults.emoji.tick} ${user.tag} was`;
		const Embeds = {
			unblacklisted: new MessageEmbed()
			.setColor(client.config.statics.defaults.colors.green)
			.setDescription(`You have been unblacklisted from Economist. This means that you're now allowed to use the bot and will no longer be ignored!`)
			.addField(
				"Developer",
				message.author.tag
			)
			.addField("Reason", args.slice(1).join(" ") || "no reason"),
			blacklisted: new MessageEmbed()
			.setColor(client.config.colors.red)
			.setDescription(`You have been blacklisted from Economist. This means that you will not be allowed to use the bot and will be ignored. If you believe you were wrongly punished, please PM ${client.users.cache.get(client.config.owner).tag}`)
			.addField(
				"Developer",
				message.author.tag
			)
			.addField("Reason", args.slice(1).join(" ") || "no reason specified")		
		}
		if (banned) {
			return message.reply({
				embed: new MessageEmbed()
				.setColor(client.config.colors.red)
				.setDescription(`${client.config.statics.defaults.emoji.err} That user is already blacklisted`)
			});
		} else {
			const mem = client.guilds.cache.get(client.config.statics.supportServer).members.cache.get(user.id);
			if (mem !== undefined) {
				await mem.roles.add(client.config.roles.blacklistedRole, `bot-banned by ${message.author.tag} (${message.author['id']}) w/ reason: ${args.slice(1).join(" ") || "no reason specified"}`).catch((x) => {});
			}
			await client.db.set("blacklist" + user['id'], 1)
			message.reply(`${msg} successfully blacklisted and was sent the following message:`);
			message.reply({ embed: Embeds.blacklisted });
			user
				.send({ embed: Embeds.blacklisted })
					.catch((x) => {});
			}
	},
};