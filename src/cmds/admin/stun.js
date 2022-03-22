"use strict";
export default {
	name: "stun",
	aliases: ["stun"],
	usage: "<user: UserResolvable> <minutes: number>",
	cst: "administrator132465798",
	description: "stuns a user, preventing them from using any commands",
	async run(client, message, args) {
		if (!args.length || (isNaN(args[1]))) return message.reply("You must specify the user to stun, along with the stun time (in minutes) in order for this command to work!");
		const usr = await client.utils.fetchUser(args[0]).catch(() => {return;});
		if (!usr) return message.reply({ content: `Invalid user "${args[0]}"`, allowedMentions: { parse: [] } });
		const mins = Math.trunc(message.createdTimestamp / 60000);
		const EoS = String(BigInt(mins) + BigInt(args[1]));
		message.channel.send(`Set stn ${usr.id} as ${EoS}`);

		await client.db.USERS.update({
			stn: EoS,
			dns: EoS,
		}, {
			where: {
				id: usr.id,
			},
		});
		message.reply(`${client.const.emoji.tick} Successfully stunned ${usr.tag} for ${client.utils.format(args[1])} minutes`);
	},
};