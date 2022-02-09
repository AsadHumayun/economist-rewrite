const { MessageEmbed, Permissions } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
	name: "cat",
	aliases: ["cat"],
	category: "fun",
	description: "Get a picture of a random cat",
	usage: "cat",
	async run(client, message) {
		if (!message.guild.me.permissions.has(Permissions.FLAGS.EMBED_LINKS)) {
			return message.reply("I need the Embed Links permission for this command to work.");
		}
		const [{ url }] = await fetch("https://api.thecatapi.com/v1/images/search").then((res) => res.json());
		message.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Meow")
					.setImage(url)
					.setColor(message.author.color),
			],
		});
	},
};