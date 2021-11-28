const { MessageEmbed } = require('discord.js');
const delay = require('delay');
const ms = require('ms');

module.exports = {
	name: 'dial',
	aliases: ['dial', 'text'],
	description: "Sends a direct message to the user who's phone number you have included. Requires a phone with a 10 minute cooldown",
	category: 'phn',	
	async run(client, message, args) {
		let lastUsed = await client.db.get('dialc' + message.author.id);
		let cd = 600000;
		if (lastUsed) {
				const now = Date.now();
				let expirationTime = Number(lastUsed) + cd;
				if (now < expirationTime) {
					let cd = Math.round((expirationTime - now) / ms('1m'));
					return message.reply(`You must wait another ${cd} minutes before texting another user!`)
				}
		};
		let cst = await client.db.get("cst" + message.author.id) || "";
				cst = cst.split(";");
		let p = cst.includes("phone");
		if (!p) return message.reply(`You must own an :iphone: in order to use this command!`);
		if (isNaN(args[0])) return message.reply(`${client.config.statics.defaults.emoji.err} You must provide a valid phone number!`)
		let number = await client.db.get(`n` + args[0]);
		if (!number) return message.reply(`${client.config.statics.defaults.emoji.err} An incorrect phone number was provided.`);
		let usr = await client.users.fetch(number);		
		let oldc = await client.db.get(`dialcount${number}`) || 0;
		await client.db.set('dialcount' + number, parseInt(oldc + 1));
		let success = true;
		let blok = await client.db.get(`isBlocked${message.author.id}${usr.id}`);
		if (blok) return message.reply(`${client.config.statics.defaults.emoji.err} You have been blocked from dialing that number!`)
		client.users.cache.get(number)
			.send({
				embed: new MessageEmbed()
				.setTitle(`${message.author.tag} has sent you a text!`)
				.setDescription(args.slice(1).join(' '))
				.setColor(message.author.color)
			}).catch((err) => {
				message.reply(`${client.config.statics.defaults.emoji.err} That user has their DMs locked`);
				success = false;
			});
			if (success == true) {
				client.users.cache.get(number).send(
					`:warning: You can prevent ${message.author.tag} from texting you again by using \`~block ${message.author.id}\` in any server`
				).catch((x) => {});
				await client.db.set('dialc' + message.author.id, Date.now(), ms('10m'));
				const msg = await message.reply({ embed: new MessageEmbed().setDescription(`Fetching phone number...`) });
				await delay(1000);
				msg.edit({
					embed: new MessageEmbed().setDescription(`${message.author.tag} has dialed ${args[0]} on their ${client.config.emoji.mobile_phone} and sent ${usr.tag} a text!`).setColor(message.author.color)
				})
			};
	},
}