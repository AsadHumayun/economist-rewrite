const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'hyphen',
	aliases: ['hyphen', 'dash', '-', 'hyphenify'],
	description: 'Hyphenify a string; usage `~hyphen Interval<Number> whatToHyphenify<string>`\nExample: `~hyphen 2 17456754` --> 17-45-67-54',
	category: 'utl',
	async run(client, message, args) {
		if (args.length < 2) {
			return message.reply("You must provide 2 valid arguments: `" + message.guild.prefix + "hyphen interval<Number> string<String>`. Example `" + message.guild.prefix + "hyphen 2 183948374` would return `18-39-48-37-4`");
		};
		let num = isNaN(args[0]) ? 1 : Number(args[0]);
		const str = args.slice(1).join(' ');
		message.reply({
			embed: new MessageEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }), client.config.inv)
			.setColor(message.author.color)
			.setDescription(client.hyphen(
				str, 
				num, 
				{
					removeWhiteSpaces: true,
					includeNewLine: true
				}
			) || "null")
		});
	},
};