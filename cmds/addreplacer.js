const { MessageEmbed } = require('discord.js');

module.exports = {
	name: "addreplacer",
	category: 'utl',
	aliases: ['addreplacer', 'replaceradd', 'newreplacer'],
	description: 'Adds a replacer; use `<replace key> <replacer content>`',
	async run(client, message, args) {
		if (args.length < 2) return message.reply({ content: `You must specify a replacer keyword and its content under the format of \`${message.guild.prefix}addreplacer <name> <content>\`; for example \`${message.guild.prefix}addreplacer firstname Alan\`.` })
		var keyword = args[0].toLowerCase();
		var content = args.slice(1).join(' ');
		if (content.length > 500) return message.reply({ content: `${client.config.statics.defaults.emoji.err} Your replacer content may not exceed 500 characters.` });
		const data = await client.db.get(`replacers${message.author.id}`) || {};
		if (Object.keys(data).length > 10 && (message.author.id != client.config.owner)) return message.reply(`You may not have more than 10 instantaneous replacers; please remove one before continuing.`);
		const newData = Object.assign({}, data, { [keyword]: { content: content, created: Date.now() } });
		await client.db.set(`replacers${message.author.id}`, newData);
		message.reply({ embeds: [
			new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`Successfully added replacer "${keyword}"`)
		]});
	},
};