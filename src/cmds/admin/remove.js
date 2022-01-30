"use strict";
export default {
	name: "remove",
	aliases: ["delete", "del", "remove"],
	description: "Deletes something from the database",
	usage: "<name of thing to delete(string)>",
	cst: "administrator132465798",
	async run(client, message, args) {
		if (args.length < 2) return message.reply("You must specify a user and a key to remove in order for this command to work!");
		const user = await client.utils.fetchUser(args[0]);
		if (!user) return message.reply({ content: `Invalid user "${args[0]}"`, allowedMentions: { parse: [] } });
		const key = args.slice(1).join(" ");
		if (!key) return message.reply`You must provide something to remove under the format of \`${message.guild ? message.guild.prefix : client.const.prefix}remove <user> <key>\``;
		const cst = message.author.data.get("cst") ? message.author.data.get("cst").split(";") : [];
		if (key == "drgn") {
			await client.db.USERS.update({
				drgn: client.const.dragon,
			}, {
				where: {
					id: user.id,
				},
			});
			return message.reply(`Successfully removed pet ${user.id}`);
		}
		try {
			const now = Date.now();
			await client.db.USERS.update({
				[key]: null,
			}, {
				where: {
					id: user.id,
				},
			});
			const diff = Date.now() - now;
			message.reply(`Successfully removed ${key} ${user.id} ${cst.includes("tmr") ? `in ${diff} miliseconds` : ""}`);
		}
		catch (err) {
			message.reply(`Error while remoivng ${user.id}.${key}\n\`${err.message}\``);
		}
	},
};