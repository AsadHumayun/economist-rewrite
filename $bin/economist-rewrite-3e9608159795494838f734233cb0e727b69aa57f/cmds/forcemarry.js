const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "forcemarry",
	aliases: ["forcemarry", "forcem", "fm"],
	description: "force-marry 2 users.",
	category: "own",
	cst: "fm",
	logAsAdminCommand: true,
	async run(client, message, args) {
		if (args.length < 2) return message.reply("You must mention two users in order for this command to work!");
		const u1 = await client.config.fetchUser(args[0]);
		if (!u1) return message.reply({ content: `Invalid identifier for user1: "${args[0]}"`, allowedMentions: { parse: [] } });
		const u2 = await client.config.fetchUser(args[1]);
		if (!u2) return message.reply({ content: `Invalid identifier for user2: "${args[1]}"`, allowedMentions: { parse: [] } });
		await client.db.set("spse" + u1.id, u2.id);
		await client.db.set("spse" + u2.id, u1.id);
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`:two_hearts: ${u1.tag} is now married to ${u2.tag}!`),
			],
		});
	},
};