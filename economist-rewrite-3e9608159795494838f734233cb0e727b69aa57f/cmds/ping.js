const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "ping",
	aliases: ["latency", "ping"],
	usage: "ping",
	desc: "See the bot's latency",
	async run(client, message) {
		message.reply({ embeds: [
			new MessageEmbed()
				.setDescription(":ping_pong: Please wait! It won't take long :) \n if you see this message it's probably not a good thing >:(")
				.setColor("RANDOM"),
		] }).then((msg) => {
			msg.edit({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setTimestamp(message.createdTimestamp)
						// template literals auto-convert to str.
						.addField("❯ __**WS Avg. Latency:**__", `${Math.round(client.ws.ping)} MS`)
						.addField("❯ __**Ping:**__", `${msg.createdTimestamp - message.createdTimestamp} MS`),
				],
			});
		});
	},
};