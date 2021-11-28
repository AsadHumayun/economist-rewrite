const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
	name: 'daily',
	aliases: ['daily'],
	category: 'ecn',	
	description: "Adds :dollar: 5,000 to your account",
	async run(client, message, args) {
		let data = await client.db.get('dlc' + message.author.id);
		data = Number(data);
		let cd = client.cooldown(message.createdTimestamp, data*client.config.exp);
		if (cd) {
				message.reply(`You must wait ${cd} before collecting your daily reward!`);
		} else {
				let bal = await client.db.get('bal' + message.author.id) || 0;
				bal = Number(bal);
				await client.db.set('dlc' + message.author.id, client.parseCd(message.createdTimestamp, ms("1d")));
				await client.db.set('bal' + message.author.id, bal + 5000);
				message.reply({
					embed: new MessageEmbed()
					.setDescription(`${message.author.tag} has collected their daily reward and received :dollar: 5,000 in cash`)
					.setColor(message.author.color)
				});
		};
	},
};