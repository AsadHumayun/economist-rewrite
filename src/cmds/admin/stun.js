"use strict";
export default {
	name: "stun",
	aliases: ["stun"],
	cst: "administrator132465798",
	description: "stuns a user, preventing them from using any commands",
	async run(client, message, args) {
		if (!args.length || (isNaN(args[1]))) return message.reply("You must specify the user to stun, along with the stun time (in minutes) in order for this command to work!");
		const usr = await client.utils.fetchUser(args[0]).catch(() => {return;});
		if (!usr) return message.reply({ content: `Invalid user "${args[0]}"`, allowedMentions: { parse: [] } });
		await client.db.USERS.update({
			stn: client.utils.parseCd(message.createdTimestamp, Number(args[1]) * 60000),
			dns: client.utils.parseCd(message.createdTimestamp, Number(args[1]) * 60000),
		}, {
			where: {
				id: usr.id,
			},
		});
		message.reply(`${client.const.emoji.tick} Successfully stunned ${usr.tag} for ${args[1]} minutes`);
	},
};