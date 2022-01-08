"use strict";
export default {
	name: "unstun",
	aliases: ["unstun", "un-stun"],
	cst: "administrator132465798",
	category: "own",
	description: "unstuns a user, allowing them to use commands",
	async run(client, message, args) {
		if (!args.length) return message.reply("You must specify the user to unstun in order for this command to work!");
		const usr = await client.utils.fetchUser(args[0]).catch(() => {return;});
		if (!usr) return message.reply(`Invalid user "${args[0]}"`, { allowedMentions: { parse: [] } });
		const data = await client.db.getUserData(usr.id);
		const stn = data.get("stn");
		if (!stn) return message.reply(`${usr.tag} is not stunned (stn=\`${stn}\`)`);
		await client.db.USERS.update({
			stn: null,
			dns: null,
		}, {
			where: {
				id: usr.id,
			},
		});
		message.reply(`:ok_hand: Unstunned ${usr.tag}. They were stunned for another ${stn - Math.trunc(message.createdTimestamp / 60_000)} minutes.`);
	},
};