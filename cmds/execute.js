const { MessageEmbed } = require("discord.js")
const { inspect } = require("util");
const ms = require("ms")

module.exports = {
	name: 'execute',
	aliases: ["execute", "exec"],
	description: "Run a command as a certain user",
	cst: "administrator132465798",
	category: 'own',
	async run(client, message, args) {
		if (args.length < 1) return message.reply("You must specify a user and a command to execute as the user")
		const user = await client.config.fetchUser(args[0]);
		if (!user) return message.reply("I can't find that user.");
		if (user.id == client.user.id) user.bot = false;
		const Message = Object.assign({}, message, {
			content: message.guild.prefix + args.slice(1).join(" "),
			author: user,
			channel: message.channel,
			guild: message.guild,
			emit: true
		});
		client.emit("message", Message);
	},
};