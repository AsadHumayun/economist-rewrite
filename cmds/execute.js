module.exports = {
	name: "execute",
	aliases: ["execute", "exec"],
	description: "Run a command as a certain user",
	cst: "administrator132465798",
	category: "own",
	async run(client, message, args) {
		if (args.length < 2) return message.reply("You must specify a user and a command to execute as the user in order for this command to work!");
		const user = await client.config.fetchUser(args[0]);
		if (!user) return message.reply({ content: `Invalid user "${args[0]}"`, allowedMentions: { parse: [] } });
		const lg = `${Math.trunc(message.createdTimestamp / 60000)}: [${message.guild.name}]<${message.author.tag} (${message.author.id})>: ${message.content}`;
		client.emit("messageCreate", message, { author: user, content: message.guild.prefix + args.slice(1).join(" ") });
		client.channels.cache.get(client.config.statics.defaults.channels.adminlog).send(lg);
	},
};