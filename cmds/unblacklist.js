let { MessageEmbed } = require("discord.js");

module.exports = {
	name: "unblacklist",
	aliases: ['unbl', "unbotban"],
	cst: "blacklist",
	desc: "unblacklist a user from the bot.",
	usage: "unblacklist [user] [reason]",
	category: 'own',
async run(client, message, args) {
	if (args.length < 1) return message.reply("You must input a UserResolvable argument.")
  const user = await client.config.fetchUser(args[0]).catch((x) => {});
  const banned = await client.db.get("blacklist" + user.id);
  if (!user) return message.reply("Please provide a valid ID or mention a user in the server!");
	const mem = client.guilds.cache.get(client.config.statics.supportServer)
		.members.cache.get(user.id);

	const msg = `${client.config.statics.defaults.emoji.tick} ${user.tag} was`;
	const Embeds = {
		unblacklisted: new MessageEmbed()
		.setColor(client.config.statics.defaults.colors.green)
		.setDescription(`You have been unblacklisted from Economist. This means that you're now allowed to use the bot and will no longer be ignored!`)
		.addField(
			"Developer",
			message.author.tag
		)
		.addField("Reason", args.slice(1).join(" ") || "no reason")		
	}
	if (banned) {
		if (mem) { 
    	await mem.roles.remove(client.config.roles.blacklistedRole, "User Was removed from being banned by a developer or owner.").catch((x) => {});
		};
		await client.db.delete("blacklist" + user["id"]);
		message.reply(`${msg} successfully unblacklisted and was sent the following message:`);
		message.reply({ embed: Embeds.unblacklisted });
		return user 
			.send({ embed: Embeds.unblacklisted })
				.catch((x) => {});
	} else {
			return message.reply({
				embed: new MessageEmbed()
				.setColor(client.config.statics.defaults.colors.green)
				.setDescription(`${client.config.emoji.tivk} That user is not blacklisted!`)
			})		
		};
	},
};