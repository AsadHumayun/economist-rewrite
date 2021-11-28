const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'viewreplacer',
	aliases: ['viewreplacer'],
	category: 'utl',
	description: 'view a stored replacer\'s content',
	async run(client, message, args) {
		const kw = args[0].toLowerCase();
		const data = await client.db.get(`replacers${message.author.id}`) || {};
		if (!Object.keys(data).includes(kw)) {
			return message.reply({
				embed: new MessageEmbed()
				.setColor(message.author['color'])
				.setDescription(`No replacer named "${kw}" found. Look in \`${message.guild.prefix}replacers\` to view a list`)
			})
		} else {
			message.reply({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setTitle(`Replacer Content | ${kw}`)
				.setDescription(data[kw].content)
				.setFooter("Created")
				.setTimestamp(data[kw].created)
			})
		}
	}
}