const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "bio",
	aliases: ["bio", "setbio"],
	category: "utl",
	description: "Edits your `bio` (Shwon in the `profile` command)",
	async run(client, message, args) {
		let str = args.join(" ");
		str = str.slice(0, 1200);

		await client.db.set("bal" + message.author.id, str);
		if (str.length >= 1) {
			message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag} has updated their profile bio!`),
				] });
		}
		else {
			message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag} has removed their bio!`),
				],
			});
		}
	},
};