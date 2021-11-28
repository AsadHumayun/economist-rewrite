const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "clrs",
	category: 'utl',
	aliases: [ "viewclrs", "clrs", "colors", "colours", "clr" ],
	description: "View someone's colour preferences",
	async run(client, message, args) {
		if (!args) args = [message.author.id]
		let usr = await client.config.fetchUser(args[0])
			.catch((x) => {});
		if (!usr) usr = message.author;
		const clrs = await client.db.get("clr" + usr.id) || client.config.defaultHexColor;
		return message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(
				`${usr.tag}'s Colour Preferences`
			)
			.setDescription(
				`Every time you use a command, each colour is cycled through sequentially. The last value is where the bot is currently at in your cycle. \n\n\`\`\`js\n${client.inspect(clrs.split(";"))}\`\`\``
			)
		});		
	}
}