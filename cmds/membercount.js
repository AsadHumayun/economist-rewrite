  const Discord = require("discord.js")

module.exports = {
	name: "membercount",
	aliases: ["members", 'membercount', 'mc'],
	description: "Gets the total members of a server and seperates them out; bot count, human count, etc, etc.",
	category: 'utl',
	usage: 'membercount',
	async run(client, message, args) {
		message.reply("", {
			embed: new Discord.MessageEmbed()
			.setAuthor(message.guild.name, message.guild.iconURL())
			.addField("Humans", message.guild.members.cache.filter(e=>!e.user.bot).size, true)
			.addField("Bots", message.guild.members.cache.filter(e=>e.user.bot).size, true)
			.addField("Total", message.guild.memberCount, true)
			.setColor(message.author.color)
		})
	},
};