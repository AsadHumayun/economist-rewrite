const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'replacers',
	aliases: ['replacers', 'supplanters'],
	description: 'View all of your currently active replacers.',
	category: 'utl',
	async run(client, message, args) {
		const data = await client.db.get(`replacers${message.author.id}`) || {};
		var count = 1;
		const msg = Object.entries(data).map(x => `${count++} \`${x[0]}\` - Created At: ${require('moment')(x[1].created).format('MMMM Do YYYY, h:mm:ss A')} - Content: ${client.trim(x[1].content, 50)}`).join('\n');
		const emb = new MessageEmbed()
		.setColor(message.author.color)
		.setTitle(`${message.author.tag}'s Installed Supplanters`)
		.setDescription(`Replacers allow you to quickly supplant text within your messages with pre-inputted text. The names listed below must be enclosed in curly brackets (\`{}\`) before they will work!\n\n${msg}`)
		message.reply(emb)
	},
};