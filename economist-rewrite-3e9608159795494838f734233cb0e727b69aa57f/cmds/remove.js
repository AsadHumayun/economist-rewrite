const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'remove',
	aliases: ['delete', 'del', 'remove'],
	description: 'Deletes something from the database',
	usage: '<name of thing to delete(string)>',
	cst: "administrator132465798",
	category: "own",	
	async run(client, message, args) {
		if (args.length < 2) return message.reply("You must specify a user and a key to remove");
		const user = await client.config.fetchUser(args[0]);
		let key = args.slice(1).join(' ');
		if (!key) return message.reply("You must provide something to remove under the format of `" + message.guild.prefix + "delete <key>" + '`');
		let cst = await client.db.get("cst" + message.author.id);
      		    cst = cst ? cst.split(";") : [];
		try {
			const now = Date.now();
			await client.db.delete(key + user.id);
			const diff = Date.now() - now;
			message.reply(`Successfully removed ${key} ${user.id} ${cst.includes("tmr") ? "in " + diff + " miliseconds." : ""}`)
		} catch (err) {
			console.error(err);
			message.reply(":x: Error => `" + err.message + "` sent to console.")
		}
	},
}