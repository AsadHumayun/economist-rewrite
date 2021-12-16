module.exports = {
	name: "unstun",
	aliases: ["unstun", "un-stun"],
	cst: "administrator132465798",
	category: "own",
	description: "unstuns a user, allowing them to use commands",
	async run(client, message, args) {
		if (!args.length) return message.reply("You must specify the user to unstun!");
		const usr = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!usr) return message.reply(`Invalid user "${args[0]}"`, { allowedMentions: { parse: [] } });
		const s = await client.db.get("stn" + usr.id);
		if (!s) return message.reply(`${usr.tag} is not stunned (stn=${s})`);
		await client.db.delete("stn" + usr.id);
		await client.db.delete("dns" + usr.id);
		message.reply(`Successfully removed [stn, dns] ${usr.tag}`);
	},
};