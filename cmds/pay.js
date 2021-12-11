const { MessageEmbed } = require('discord.js');
require('keyv');

module.exports = {
	name: 'pay',
	aliases: ['pay'],
	category: 'ecn',
	description: 'Pay someone else :dollar:\n\nTo pay someone your entire balance, use `all`',
	usage: 'pay <user> <amount>',
	dev: false,
	guild: false,
	col: false,
	disabled: false,
	async run(client, message, args) {
		client.config.fetchUser = async function (str) {
			str = str.toString();
			if (!str) return;
			let usr;
			try {
				usr = await client.users.fetch(client.getID(str))
			} catch (err) {
				usr = await client.users.fetch(str).catch((x) => {})
			};	
			return usr;
		}

		/**
		 * Tells the `user` they don't have enough money t pay someone else.
		 */
		function notEnough() {
			return message.reply("You don't have enough :dollar: in your bank!")
		}
		let authorBal = await client.db.get('bal' + message.author.id) || 0;
			authorBal = Number(authorBal)
		if (!args.length) return message.reply("You must tell me who to transfer money to!");
			let usr;
				try {
					usr = await client.users.fetch(client.getID(args[0]))
				} catch (err) {
					usr = await client.users.fetch(args[0]).catch((x) => message.reply('invalid user '))
				};
			if (!usr) return message.reply("Whoops! I can't find that user");
			if (message.author.id == usr.id) return message.reply(`You can't pay yourself!`);
			if (!args[1]) return message.reply("You must specify the amount of :dollar: you wish to pay " + usr.username);
		let amt = args[1].toLowerCase();
		if (amt.toString().startsWith('all')) amt = authorBal;
    if (amt.toString().startsWith('half')) amt = authorBal / 2;
		amt = Number(amt);
		amt = Math.trunc(amt);
		if (amt < 1) return message.reply("You must enter a positive number.");
		//console.log(amt, typeof Number(amt)) // => 10, Number
		if (isNaN(amt) && (!amt.startsWith('all') ||!amt.startsWith('half'))) return message.reply("You must provide a valid number! (or just `all`|`half`)")
		if (authorBal < 0 || (!authorBal) || (Number(authorBal - amt) < 0)) return notEnough();
		const amountLeft = Number(Number(authorBal) - Number(amt));
		if (amountLeft < 0) return notEnough();
		 await client.db.set('bal' + message.author.id, amountLeft);
		let oldBal = await client.db.get('bal' + usr.id) || 0;
			oldBal = Number(oldBal)
		const newBal = Number(oldBal + amt);
		await client.db.set('bal' + usr.id, newBal)
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has paid :dollar: ${message.author.com == 1 ? amt : client.config.comma(amt)} (${amt.toString().length} digits) into ${usr.tag}'s account`)
		})
	},
}