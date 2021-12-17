module.exports = {
	name: "permstun",
	aliases: ["permstun", "perm"],
	description: "Permanently stuns a user",
	category: "own",
	cst: "administrator132465798",
	async run(client, message, args) {
		if (!args.length) return message.reply(`You must supply a user argument alongside a reason under the format \`${message.guild.prefix}permstun <user> [reason]\``);
		const user = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!user) return message.reply({ content: `Invalid user "${args[0]}"`, allowedMentions: { parse: [] } });
		const stnb = args.slice(1).join(" ");
		let cst = await client.db.get("cst" + user.id);
		cst = cst ? cst.split(";") : [];
		// pstn just perm stuns the user - this acts as a blacklist and blocks the user from using the bot.
		cst.push("pstn");
		await client.db.set("cst" + user.id, cst.join(";"));
		await client.db.set("stnb" + user.id, stnb);
		message.reply(`Successfully perm stunned ${user.tag} (${user.id}) with stnb "${stnb || "stunned"}"`);
	},
};