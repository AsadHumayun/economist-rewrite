"use strict";
export default {
	name: "permstun",
	aliases: ["permstun", "perm"],
	description: "Permanently stuns a user",
	category: "own",
	cst: "administrator132465798",
	async run(client, message, args) {
		if (!args.length) return message.reply(`You must supply a user argument alongside a reason under the format \`${message.guild ? message.guild.prefix : client.const.prefix}permstun <user> [reason]\``);
		const user = await client.utils.fetchUser(args[0]).catch(() => {return;});
		if (!user) return message.reply({ content: `Invalid user "${args[0]}"`, allowedMentions: { parse: [] } });
		await client.db.getUserData(user.id);
		const stnb = args.slice(1).join(" ") || "stunned";
		const cst = message.author.data.get("cst") ? message.author.data.get("cst").split(";") : [];
		// pstn just perm stuns the user - this acts as a blacklist and blocks the user from using the bot.
		cst.push("pstn");
		await client.db.USERS.update({
			cst: cst.join(";"),
			stnb,
		}, {
			where: {
				id: user.id,
			},
		});
		message.reply(`:ok_hand: perm stunned ${user.tag} with stnb ${stnb || "stunned"}`);
	},
};