const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "deldata",
	aliases: ["deldata", "removedata", "forget"],
	description: "Innact the right to be forgotten (deletes all your data)",
	cst: "administrator132465798",
	category: "own",
	async run(client, message, args) {
		if (!args.length) return message.reply("You must mention someone for me to forget!");
		const usr = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!usr) return message.reply(`Unidentifiable user "${args[0]}"`);
		let scs = 0;
		const ftr = [];
		for (const x in client.keys) {
			await client.db.delete(`${client.keys[x]}${usr.id}`)
				.then(() => scs++)
				.catch((error) => ftr.push([client.keys[x], error]));
		}
		message.reply({
			content: `Failed to remove the following keys: ${ftr.map((e) => `\`${e[0]}\``).join(", ")}`,
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`Successfully removed ${scs}/${client.keys.length} keys from ${usr.tag}(${usr.id})`),
			],
		});
	},
};