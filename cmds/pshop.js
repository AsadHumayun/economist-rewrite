const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "pshop",
	description: "View a list of permissions which you can buy and the amount of XP needed to buy them!",
	category: "utl",
	async run(client, message) {
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setTitle("XP Shop — " + message.author.tag)
					.setDescription(`
			Here's a list of permissions which you can purchase via \`${message.guild.prefix}pbuy <item>\`.
			
			${client.config.statics.ditems.map((x) => `**${client.capital(x.split(";")[1])}**: \`${x.split(";")[3]}\` XP`).join("\n")}        
							`),
			],
		});
	},
};