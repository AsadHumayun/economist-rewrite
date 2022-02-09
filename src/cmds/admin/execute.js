"use strict";

export default {
	name: "execute",
	aliases: ["execute", "exec"],
	usage: "<user: UserResolvable> <command: string> <...arguments: ...string>",
	description: "Run a command as a certain user",
	cst: "administrator132465798",
	async run(client, message, args) {
		if (args.length < 2) return message.reply("You must specify a user and a command to execute as the user in order for this command to work!");
		const user = await client.utils.fetchUser(args[0]);
		if (!user) return message.reply({ content: `Invalid user "${args[0]}"`, allowedMentions: { parse: [] } });
		if ((["eval", "execute", "exec"].includes(args[1].toLowerCase()) || client.const.owners.includes(user.id))) return;
		client.emit("messageCreate", message, { author: user, content: (message.guild?.prefix || "~") + args.slice(1).join(" ") });
	},
};