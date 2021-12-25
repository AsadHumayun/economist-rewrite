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
		if (!usr) return message.reply({ content: `Unidentifiable user "${args[0]}"`, allowedMentions: { parse: [] } });
		const userData = await client.db.USERS.findOne({ where: { id: usr.id } });
		if (!userData) {
			return message.reply({
				embeds: [
					new MessageEmbed()
						.setColor("#da0000")
						.setDescription(`No matching record found for U:<${usr.tag} ${usr.id}>`),
				],
			});
		}
		await userData.destroy()
			.then(() => message.reply({ embeds: [ new MessageEmbed().setColor(message.author.color).setDescription(`Successfully removed all user data for U: <${usr.tag} (${usr.id})>`) ] }))
			.catch((err) => message.reply(`An error occurred: \`${err}\``));
	},
};