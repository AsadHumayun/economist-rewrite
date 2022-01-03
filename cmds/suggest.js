"use strict";
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'suggest',
	aliases: ['suggest', 'addsmthnew'],
	description: 'Suggest a new idea to be added to the bot; will be posted in <#758598514623643690>',
	category: 'utl',
	async run(client, message, args) {
		let cd = await client.db.get("sgstc" + message.author.id);
		let scnd = client.config.cooldown(message.createdTimestamp, cd*60_000);
		if (scnd) {
			return message.reply(`You must wait another ${scnd} before suggesting again`);
		};

		if (!args.length) return message.reply(`You must provide a suggestion for me to uhh... suggest?`)
		await client.db.set('sgstc' + message.author.id, client.config.parseCd(message.createdTimestamp, 20000, true));				
		var suggest = args.join(' ');
			message.reply({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`Your suggestion was successfully posted in our [support server](${client.config.ssInvite})`)
			});
			client.channels.cache.get(client.config.channels.suggestions)
				.send({
					embed: new MessageEmbed()
					.setColor(message.author.color)
					.setTitle(`New Suggestion`)
					.setThumbnail(message.author.displayAvatarURL())
					.setDescription(suggest)
					.setFooter(`${message.author.tag} (${message.author.id})`)
				})
					.then((m) => { m.react('👍'); m.react('👎') });
	}
}