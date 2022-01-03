"use strict";
const Discord = require('discord.js');
const fetch = require('node-fetch')
const querystring = require('querystring')

module.exports = {
	name: 'urban',
	aliases: ['urban', 'define'],
	category: 'utl',
	description: "Search the urban dictionary for something. It will show the first given result/definition. Can only be used in NSFW channels.",
	usage: 'urban <word>',
	async run(client, message, args) {
		if (!args.length) {
			return message.reply(`You need to include something to search the urban dictionary for`)
		}
		const query = querystring.stringify({ term: args.join(' ') });

		const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`, { method: "GET" }).then(response => response.json());
		if (!list) {
			return message.reply(`I cannot find that word!`)
		}
		let [answer] = list;
		if (!answer) return message.reply("Your search has yielded no results!")
		let embed = new Discord.MessageEmbed()
		.setColor(message.author.color)
		.setTitle(answer.word)
		.setURL(answer.permalink)
		.addField("Definition", client.config.trim(answer.definition, 1024))
		.addField("Example", answer.example ? `\`\`\`css\n${client.config.trim(answer.example, 1000)}\n\`\`\`` : "\`\`\`\nNo example found\n\`\`\`")
		.setFooter(`👍 ${client.config.comma(answer.thumbs_up)} | 👎 ${client.config.comma(answer.thumbs_down)}`);
		return message.reply({ embed })
	},
};